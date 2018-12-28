/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `users`. (Can be re-generated.)
const merge = require("lodash.merge");
// !code: imports // !end
// !code: init // !end

let moduleExports = merge(
  {},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      username: {
        minLength: 4,
        maxLength: 10,
        faker: "internet.userName",
        bsonType: "string"
      },
      email: {
        format: "email",
        faker: "internet.email",
        bsonType: "string"
      },
      password: {
        faker: "internet.password",
        minLength: 5,
        bsonType: "string"
      },
      dateOfBirth: {
        format: "date",
        bsonType: "string"
      },
      ip: {
        format: "ipv4",
        faker: "internet.ip",
        bsonType: "string"
      },
      roleId: {
        ref: "roles",
        faker: {
          fk: "roles:random"
        },
        bsonType: "objectId"
      },
      emailConfirmId: {
        ref: "emailConfirmation",
        faker: {
          fk: "emailConfirmation:random"
        },
        bsonType: "objectId"
      },
      accountTypeId: {
        ref: "accountTypes",
        faker: {
          fk: "accountTypes:random"
        },
        bsonType: "objectId"
      },
      fosta: {
        chance: {
          bool: {
            likelihood: 65
          }
        },
        bsonType: "boolean"
      },
      deletedAt: {
        chance: {
          integer: {
            min: -1,
            max: -1
          }
        },
        bsonType: "number"
      }
    },
    required: [
      "username",
      "email",
      "password",
      "roleId",
      "accountTypeId",
      "fosta",
      "dateOfBirth"
    ]
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
