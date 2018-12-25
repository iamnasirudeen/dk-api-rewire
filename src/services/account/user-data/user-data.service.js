// Initializes the `userData` service on path `/user-data`. (Can be re-generated.)
const createService = require("feathers-mongoose");
const createModel = require("../../../models/account/user-data.model");
const hooks = require("./user-data.hooks");
// !code: imports // !end
// !code: init // !end

let moduleExports = function(app) {
  let Model = createModel(app);
  let paginate = app.get("paginate");
  // !code: func_init // !end

  let options = {
    Model,
    paginate
    // !code: options_more // !end
  };
  // !code: options_change // !end

  // Initialize our service with any options it requires
  app.use("/user-data", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-data");

  service.hooks(hooks);
  // !code: func_return // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
