// Configure the Feathers services. (Can be re-generated.)
let accountTypes = require("./account/account-types/account-types.service");
let apiKeys = require("./base/api-keys/api-keys.service");
let emailConfirmation = require("./account/email-confirmation/email-confirmation.service");
let forgotPassword = require("./account/forgot-password/forgot-password.service");
let history = require("./base/history/history.service");
let optionValues = require("./options/option-values/option-values.service");
let options = require("./options/options/options.service");
let roles = require("./account/roles/roles.service");
let userData = require("./account/user-data/user-data.service");
let users = require("./account/users/users.service");

// !code: imports // !end
// !code: init // !end

// eslint-disable-next-line no-unused-vars
let moduleExports = function(app) {
  app.configure(accountTypes);
  app.configure(apiKeys);
  app.configure(emailConfirmation);
  app.configure(forgotPassword);
  app.configure(history);
  app.configure(optionValues);
  app.configure(options);
  app.configure(roles);
  app.configure(userData);
  app.configure(users);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
