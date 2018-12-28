/* eslint quotes: 0 */
// Defines Sequelize model for service `users`. (Can be re-generated.)
const merge = require("lodash.merge");
const Sequelize = require("sequelize");
// eslint-disable-next-line no-unused-vars
const DataTypes = Sequelize.DataTypes;
// !code: imports // !end
// !code: init // !end

// Your model may need the following fields:
//   email:      { type: DataTypes.STRING, allowNull: false, unique: true },
//   password:   { type: DataTypes.STRING, allowNull: false },
let moduleExports = merge(
  {},
  // !<DEFAULT> code: sequelize_model
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ip: {
      type: DataTypes.TEXT
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailConfirmId: {
      type: DataTypes.INTEGER
    },
    accountTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fosta: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
