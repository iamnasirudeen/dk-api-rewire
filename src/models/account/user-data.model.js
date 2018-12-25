// userData-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !ode: mongoose_schema
const mongooseSchema = require("../../services/account/user-data/user-data.mongoose");
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
  const userData = new mongooseClient.Schema(mongooseSchema, {
    timestamps: true
  });
  userData.plugin(accessibleFieldsPlugin);
  userData.plugin(accessibleRecordsPlugin);
  // !end

  let existingModel = mongooseClient.models["userData"]; // needed for client/server tests
  let returns = existingModel || mongooseClient.model("userData", userData);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
