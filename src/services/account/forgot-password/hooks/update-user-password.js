// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
/**
 *
 * Updates the user's password after successfully verifying the user's request using a patch call
 *
 */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["patch"]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    /*
    Modify records and/or context.
     */

    // console.log(context._user_); // eslint-disable-line
    const { query, data } = context._user_;
    if (data && data.password) {
      await context.app.service("/users").patch(null, data, { query });
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
  throw new Error(msg);
}
