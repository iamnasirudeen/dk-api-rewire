// const userAbilities = require('./../factory/userAbilities');
const _ = require('lodash');
const capitalize = require('capitalize');
const abilities = require('../abilities');
const {
  Forbidden
} = require('@feathersjs/errors');


// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {

  // Return the actual hook.
  return async (context) => {
    // Holds the service name(path) if set in options or use the path in the context
    const servicePath = options.servicePath || context.path;
    // Using camel-case, feathers-plus generator uses it to generate model names
    const subjectName = _.camelCase(servicePath);
    const capitalizedPath = capitalize.words(servicePath.split('-').join(' '));

    // Method for the request [ 'find', 'create', 'remove', 'update', 'patch']
    const action = context.method;
    // Holds the service name(path) if set in options or use the path in the context
    // Load all the roles
    const roleRecords = await context.app.service('/roles').find({});
    let roles = {};
    // Map the roles to get their _id and name
    roleRecords.data.map(({
      _id,
      name
    }) => (roles[name.toString()] = _id.toString()));
    // Set the roles in the app
    context.app.set('roles', roles);
    // Loads the abilities for the current user based on their role.
    const abilitiesByRole = abilities(context.params.user, roles);
    // First test if the user can do the action.
    // Can read, update, patch, remove the resource subjectName
    try {
      // Get the two set of abilities by user and their role
      abilitiesByRole.actionsAbility.throwUnlessCan(action, subjectName);
    } catch (error) {
      // Throws forbidden error if the permission is not set
      const userRoleData = await context.app.service('/roles').get(context.params.user.roleId);
      throwError(`${userRoleData.name} cannot ${action} ${capitalizedPath}`);
    }
    // Get the fields that are defined for the role
    const fieldsAbility = abilitiesByRole.fieldsAbility;
    // Get the model for the service (registered with the service path)
    const model = context.app.service(servicePath).Model;
    // Get readable fields to be used tp strip off fields from the returned result
    const readableFields = model.accessibleFieldsBy(fieldsAbility, 'read');
    // Service for the mutation
    const subjectService = context.app.service(servicePath);
    // Strips off provider from the params
    const _params = Object.assign({}, context.params, {
      provider: null
    });
    const data = context.data; // passed data from the request
    // Holds the defined fields based on the action
    const accessibleFields = model.accessibleFieldsBy(fieldsAbility, action);
    // Pick the fields that can be updated/patched/created by the user role
    const selectedFields = _.pick(data, accessibleFields);
    const id = context.id; // Document id from the request
    if (id) { // An id is set
      // Ensure this is executed when the call is one of patch/update/remove
      if (['update', 'patch', 'remove'].includes(action)) {
        // Loads all the records that can be worked on by the user based on the rule conditions set in the ability.
        // When no rule us set for the action it returns all records
        const accessibleRecords = await model.accessibleBy(fieldsAbility, action).exec();
        // Find the record matching the id
        const index = accessibleRecords.findIndex(r => id === r._id.toString());

        // Sent id can not be found in the allowed records.
        // Meaning the user does not have right to do the action on the resource based on the returned records
        // Throws forbidden error
        if (index < 0) {
          throwError(`You are not allowed to '${action}' '${capitalizedPath}' with '${id}'`);
        }
        // Update/Patch can be done, continue.
        const record = accessibleRecords[index]; // Record to be updated/patched
        // Merge the selected permitted fields from the ability with the record
        // Making sure we have full and consistent schema for update/patch
        const mergedFields = _.merge(record, selectedFields);
        // Set the merged data on the actual context to override missing fields error
        context.data = mergedFields;
        // Use the action to do the data mutation, skipping other database calls
        const actionResult = await subjectService[action](id, mergedFields, _params);
        // Pick readable fields to return as result
        context.result = pickReadableFields(actionResult, readableFields);
        // Not needed, as we are using the full data from the records
        // REDUNDANT!!!
        // context.params.skipRemainingHooks = true;
      } else if (action === 'get') {
        const getResult = await subjectService.get(id, _params);
        // Executed for GET requests with id parameter being set
        // Ensuring we are not exposing un-authorized fields
        context.result = pickReadableFields(getResult, readableFields); // skips DB calls
      }
    } else if (action === 'find') {
      // Do the actual find request, removing the provider
      const findResult = await subjectService.find(_params);
      // Executed for GET requests with no id parameter
      // Picks the permitted fields for each returned items
      // Ensuring we are not exposing un - authorized fields
      findResult.data = pickReadableFields(findResult.data, readableFields);
      // Finally set the result for find request, skipping extra DB call.
      context.result = findResult;
    } else if (action === 'create') {
      delete _params.query; // Remove query, not needed when creating a resource
      // Do the actual find request, removing the provider
      // Selected fields is used to take care of sending unnecessary fields
      let createResult = await subjectService.create(selectedFields, _params);
      // Create the actual resource, but returned only readable fields
      // Picks the permitted fields for each returned items
      // Ensuring we are not exposing un - authorized fields after creation
      createResult = pickReadableFields(createResult, readableFields);
      // Finally set the result for find request, skipping extra DB call.
      context.result = createResult;
    }
    return context;
  };
};


// Throw to reject the service call, or on an unrecoverable error.
// eslint-disable-next-line no-unused-vars
function throwError(msg) {
  throw new Forbidden(msg);
}

const pickReadableFields = (items, readableFields) => {
  let returnItems;
  if (Array.isArray(items)) {
    returnItems = _.map(items, _.partialRight(_.pick, readableFields));
  } else {
    returnItems = _.pick(items, readableFields);
  }
  return returnItems;
};
