/* eslint-disable */
const { AbilityBuilder } = require("@casl/ability");

const rulesForActions = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();

  return rules;
};

const rulesForFields = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();

  return rules;
};

module.exports = {
  rulesForActions,
  rulesForFields
};
