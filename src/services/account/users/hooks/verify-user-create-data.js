// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext, getItems } = require("feathers-hooks-common");
const { BadRequest } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["create"]);
    // roleId and accountTypeId sent by the user
    const { roleId, accountTypeId } = getItems(context);

    /*
    Modify records and/or context.
     */
    try {
      await context.app.service("/roles").get(roleId);
      const accountTypeRecord = await context.app
        .service("/account-types")
        .get(accountTypeId);
      // Detects if the account type is not published and throw an error containing the account type _id from the data
      accountTypeRecord.published
        ? null
        : error(`${accountTypeId} not published`);
    } catch (e) {
      // Detects which error was thrown by detecting if the error message contains one of the ids
      let msg = e.message.includes(roleId)
        ? `Invalid '${roleId}' for roleId`
        : `Invalid '${accountTypeId}' for accountTypeId`;
      // throws BadRequest error if the user had used a bad roleId or accountTypeId
      throw error(msg);
    }
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new BadRequest(msg);
}
