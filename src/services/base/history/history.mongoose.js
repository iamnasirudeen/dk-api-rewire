/* eslint quotes: 0 */
// Defines Mongoose model for service `history`. (Can be re-generated.)
const merge = require("lodash.merge");
// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose");
// !code: imports // !end
// !code: init // !end

let moduleExports = merge(
  {},
  // !<DEFAULT> code: model
  {
    type: {
      type: String,
      enum: ["before", "after", "error"],
      required: true
    },
    path: {
      type: String,
      required: true
    },
    method: {
      type: String,
      enum: ["find", "get", "create", "update", "patch", "remove"],
      required: true
    },
    meta: {},
    user: {},
    provider: String
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
