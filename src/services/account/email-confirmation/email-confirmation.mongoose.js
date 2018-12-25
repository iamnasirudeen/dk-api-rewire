/* eslint quotes: 0 */
// Defines Mongoose model for service `emailConfirmation`. (Can be re-generated.)
const merge = require("lodash.merge");
// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose");
// !code: imports // !end
// !code: init // !end

let moduleExports = merge(
  {},
  // !<DEFAULT> code: model
  {
    status: {
      type: Boolean,
      enum: [true, false]
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    deletedAt: Number
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
