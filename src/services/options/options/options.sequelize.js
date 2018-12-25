/* eslint quotes: 0 */
// Defines Sequelize model for service `options`. (Can be re-generated.)
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
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false
    },
    shortName: {
      type: DataTypes.TEXT
    },
    longName: {
      type: DataTypes.TEXT
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    displayOrder: {
      type: DataTypes.REAL
    },
    type: {
      type: Sequelize.ENUM(["single", "multi"]),
      allowNull: false,
      default: "single"
    },
    deletedAt: {
      type: DataTypes.REAL
    }
  }
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
