/* eslint quotes: 0 */
// Defines Mongoose model for service `optionValues`. (Can be re-generated.)
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
      required: true
    },
    shortName: String,
    longName: String,
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    accountTypeIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true
    },
    displayOrder: Number,
    deletedAt: Number
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
