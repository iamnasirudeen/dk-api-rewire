// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["find", "get", "create", "patch"]);
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    /*
    Modify records and/or context.
     */
    // A patch call with email not set in the body of the call
    if (context.method === "patch" && !records.email) {
      // We need email too when patching the user's record.
      // Using the 'key' ordinarily does not guarantee our safety
      const params = context.params;
      params.query = params.query || {};
      // Set the email to empty, guarantees that it will never match any record since email is required for every call
      params.query.email = params.query.email || "";
      // Ensure that only record with false status can be patched
      params.query.status = { $eq: false };
      params.query.key = { $eq: params.query.key || "" };

      const findResult = await context.service.find({ query: params.query });
      if (!findResult.total) {
        error(`Key '${params.query.key.$eq}' is not available`);
      }

      // Makes sure that we can only patch the status and nothing else
      // This allows for calling this service directly from the client to confirm the user's email
      if (Array.isArray(records)) {
        records.map(r => ({ status: r.status || false }));
      } else {
        records = { status: records.status || false };
      }
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new NotFound(msg);
}
