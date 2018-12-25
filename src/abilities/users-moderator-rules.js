/* eslint-disable */

const { AbilityBuilder } = require("@casl/ability");

const rulesForActions = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();
  can("read", "users");
  can("manage", "users");
  return rules;
};

const rulesForFields = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();
  can("read", "users");
  can("manage", "users");
  return rules;
};

module.exports = {
  rulesForActions,
  rulesForFields
};
