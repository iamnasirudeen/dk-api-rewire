/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `options`. (Can be re-generated.)
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
      userId: {
        fk: "users:random",
        bsonType: "objectId"
      },
      displayOrder: {
        minimum: 0,
        bsonType: "number"
      },
      type: {
        enum: ["single", "multi"],
        default: "single",
        bsonType: "string"
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
    required: ["name", "userId", "type"]
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
