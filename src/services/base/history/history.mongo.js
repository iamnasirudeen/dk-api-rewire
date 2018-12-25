/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `history`. (Can be re-generated.)
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
      type: {
        enum: ["before", "after", "error"],
        bsonType: "string"
      },
      path: {
        bsonType: "string"
      },
      method: {
        enum: ["find", "get", "create", "update", "patch", "remove"],
        bsonType: "string"
      },
      meta: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          }
        }
      },
      user: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          }
        }
      },
      provider: {
        bsonType: "string"
      }
    },
    required: ["path", "type", "method"]
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
