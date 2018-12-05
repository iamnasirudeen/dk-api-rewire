
// Configure the Feathers services. (Can be re-generated.)
let accountTypes = require('./account/account-types/account-types.service');
let history = require('./base/history/history.service');
let roles = require('./account/roles/roles.service');
let users = require('./account/users/users.service');

// !code: imports // !end
// !code: init // !end

// eslint-disable-next-line no-unused-vars
let moduleExports = function (app) {
  app.configure(accountTypes);
  app.configure(history);
  app.configure(roles);
  app.configure(users);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
