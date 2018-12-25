/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `apiKeys`. (Can be re-generated.)
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
      deviceName: {
        enum: [
          "mobile-android",
          "mobile-ios",
          "mobile-browser",
          "desktop",
          "generic"
        ],
        bsonType: "string"
      },
      key: {
        bsonType: "string"
      },
      status: {
        boolean: ["LIVE", "DEAD"],
        bsonType: "string"
      },
      hits: {
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
    required: ["key", "deviceName"]
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
