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
  can('create', 'all');
  // Use the model names to define the subject name
  can('manage', 'all');
  // Reading authorization
  can('read', 'all');
  return rules;
};

const rulesForFields = (user) => {
  let {
    rules,
    can,
    cannot
  } = AbilityBuilder.extract();
  can('read', 'all');
  can('manage', 'all');
  // Fields to pick when creating and updating
  can('create', 'all');
  return rules;
};

module.exports = {
  rulesForActions,
  rulesForFields
};