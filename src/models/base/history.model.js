// history-model.js - A Mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
// !code: mongoose_schema
const mongooseSchema = require('../../services/base/history/history.mongoose');
const {
  accessibleFieldsPlugin,
  accessibleRecordsPlugin
} = require('@casl/mongoose');
// !end
// !code: mongoose_imports // !end
// !code: mongoose_init // !end

let moduleExports = function (app) {
  let mongooseClient = app.get('mongooseClient');
  // !code: mongoose_func_init // !end

  // !code: mongoose_client
  const history = new mongooseClient.Schema(mongooseSchema, {
    timestamps: true
  });
  history.plugin(accessibleFieldsPlugin);
  history.plugin(accessibleRecordsPlugin);
  // !end

  let existingModel = mongooseClient.models['history']; // needed for client/server tests
  let returns = existingModel || mongooseClient.model('history', history);

  // !code: mongoose_func_return // !end
  return returns;
};
// !code: mongoose_more // !end

// !code: mongoose_exports // !end
module.exports = moduleExports;

// !code: mongoose_funcs // !end
// !code: mongoose_end // !end
