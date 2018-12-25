/* eslint quotes: 0 */
// Defines Sequelize model for service `history`. (Can be re-generated.)
const merge = require("lodash.merge");
const Sequelize = require("sequelize");
// eslint-disable-next-line no-unused-vars
const DataTypes = Sequelize.DataTypes;
// !code: imports // !end
// !code: init // !end

let moduleExports = merge(
  {},
  // !<DEFAULT> code: sequelize_model
  {
    type: {
      type: Sequelize.ENUM(["before", "after", "error"]),
      allowNull: false
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    method: {
      type: Sequelize.ENUM([
        "find",
        "get",
        "create",
        "update",
        "patch",
        "remove"
      ]),
      allowNull: false
    },
    meta: {
      type: DataTypes.JSONB
    },
    user: {
      type: DataTypes.JSONB
    },
    provider: {
      type: DataTypes.TEXT
    }
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
