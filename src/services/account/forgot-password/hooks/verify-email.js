// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { getItems, isProvider } = require("feathers-hooks-common");
const { BadRequest } = require("@feathersjs/errors");

/**
 *
 * Verify that the user has been registered
 *
 */
module.exports = function() {
  // Return the actual hook.
  return async context => {
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    if (isProvider("external")(context)) {
      const data = { email: records.email || context.params.query.email || "" };
      const result = await context.app.service("/users").find({ query: data });
      if (!result.total) {
        error(`${data.email} is not registered`);
      }
    }
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new BadRequest(msg);
}
