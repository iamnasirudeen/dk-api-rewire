// eslint-disable
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext, getItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
    ]);

    // getItems always returns an array to simplify your processing.
    const { id, error, params, type, path, method } = context;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    const records = getItems(context);
    const meta = {
      records
    };
    // Get the error if any
    if (error) {
      meta.error = context.error;
      delete meta.error.hook;
    }
    // Get the id if any
    if (id) {
      meta.id = context.id;
    }
    // Get the query if set
    if (params && params.query) {
      meta.query = JSON.stringify(params.query);
    }
    // Get the query if set
    if (params && params.data) {
      meta.query = JSON.stringify(params.data);
    }
    // Get the query if set
    if (params && params.result) {
      meta.query = JSON.stringify(params.result);
    }
    // Use the user from the params or use an empty object
    const user = (params && params.user) || {};
    // Set where the request is coming from
    const provider = (params && params.provider) || "";
    // Don't do anything if we are calling the history service itself
    if (context.path !== "history") {
      const historyService = context.app.service("/history");
      // Construct the data
      const data = {
        path,
        method,
        type,
        meta,
        user,
        provider
      };
      // console.log(data);
      await historyService.create(data);
    }
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw to reject the service call, or on an unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
