
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `accountTypes`. (Can be re-generated.)
const merge = require('lodash.merge');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      name: {
        minLength: 5,
        maxLength: 20,
        faker: "lorem.word",
        bsonType: "string"
      },
      published: {
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
      "name",
      "published"
    ]
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
