/* eslint quotes: 0 */
// Defines Mongoose model for service `accountTypes`. (Can be re-generated.)
const merge = require("lodash.merge");
// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose");
// !code: imports // !end
// !code: init // !end

let moduleExports = merge(
  {},
  // !<DEFAULT> code: model
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    displayOrder: Number,
    published: {
      type: Boolean,
      required: true
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
