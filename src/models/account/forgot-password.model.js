// forgotPassword-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !<DEFAULT> code: mongoose_schema
const mongooseSchema = require("../../services/account/forgot-password/forgot-password.mongoose");
// !end
// !code: mongoose_imports
const {
  accessibleFieldsPlugin,
  accessibleRecordsPlugin
} = require("@casl/mongoose");
// !end
// !code: mongoose_init // !end

let moduleExports = function(app) {
  let mongooseClient = app.get("mongooseClient");
  // !code: mongoose_func_init // !end

  // !code: mongoose_client
  const forgotPassword = new mongooseClient.Schema(mongooseSchema, {
    timestamps: true
  });

  forgotPassword.plugin(accessibleFieldsPlugin);
  forgotPassword.plugin(accessibleRecordsPlugin);
  // !end

  let existingModel = mongooseClient.models["forgotPassword"]; // needed for client/server tests
  let returns =
    existingModel || mongooseClient.model("forgotPassword", forgotPassword);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
