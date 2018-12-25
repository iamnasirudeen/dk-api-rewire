/* eslint-disable */
const { AbilityBuilder } = require("@casl/ability");

const rulesForActions = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();
  can("read", "users");
  can("update", "users");
  can("remove", "users");
  return rules;
};

const rulesForFields = user => {
  let { rules, can, cannot } = AbilityBuilder.extract();
  can("update", "users", ["username", "email", "password", "dateOfBirth"], {
    _id: user._id
  });
  can("remove", "users", {
    _id: user._id
  });
  // Fields open to reading for basic user
  can("read", "users", [
    "_id",
    "username",
    "email",
    "password",
    "dateOfBirth",
    "roleId",
    "accountTypeId",
    "fosta",
    "deletedAt",
    "updatedAt",
    "createdAt"
  ]);

  // Fields to pick when creating a user
  can("create", "users", [
    "_id",
    "username",
    "email",
    "password",
    "dateOfBirth",
    "roleId",
    "accountTypeId",
    "fosta"
  ]);
  return rules;
};

module.exports = {
  rulesForActions,
  rulesForFields
};
