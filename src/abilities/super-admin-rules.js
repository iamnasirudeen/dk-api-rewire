/* eslint-disable */
const {
  AbilityBuilder
} = require('@casl/ability');

const rulesForActions = (user) => {
  let {
    rules,
    can,
    cannot
  } = AbilityBuilder.extract();
  can('create', 'roles');
  // Use the model names to define the subject name
  can('create', 'accountTypes');
  can('manage', 'roles');
  can('manage', 'accountTypes');
  can('read', 'roles');
  can('read', 'accountTypes');
  return rules;
};

const rulesForFields = (user) => {
  let {
    rules,
    can,
    cannot
  } = AbilityBuilder.extract();
  can('read', 'roles');
  can('read', 'accountTypes');
  can('manage', 'roles');
  can('manage', 'accountTypes');
  // Fields to pick when creating and updating
  can(['create', 'read'], 'roles', ['name']);
  can(['create', 'read'], 'accountTypes', ['name', 'published']);
  return rules;
};

module.exports = {
  rulesForActions,
  rulesForFields
};
