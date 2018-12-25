/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `optionValues`. (Can be re-generated.)
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
      name: {
        bsonType: "string"
      },
      shortName: {
        bsonType: "string"
      },
      longName: {
        bsonType: "string"
      },
      option: {
        faker: {
          fk: "options:random"
        },
        ref: "options",
        bsonType: "objectId"
      },
      author: {
        faker: {
          fk: "users:random"
        },
        ref: "users",
        bsonType: "objectId"
      },
      accountTypes: {
        items: {
          type: "ID"
        },
        ref: "accountTypes",
        uniqueItems: true,
        maxItems: 5,
        minItems: 1,
        bsonType: "array"
      },
      displayOrder: {
        bsonType: "number"
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
    required: ["name", "author", "accountTypes"]
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
