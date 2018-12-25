/* eslint quotes: 0 */
// Defines Sequelize model for service `optionValues`. (Can be re-generated.)
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
      allowNull: false
    },
    shortName: {
      type: DataTypes.TEXT
    },
    longName: {
      type: DataTypes.TEXT
    },
    option: {
      type: DataTypes.INTEGER
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accountTypes: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    displayOrder: {
      type: DataTypes.REAL
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
