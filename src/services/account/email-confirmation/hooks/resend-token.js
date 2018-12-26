// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { getItems } = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // This will be used on resend confirmation calls
    // calls with patch and containing email are believed to want their token resent to them.
    const data = getItems(context);
    if (context.method === "patch" && data.email) {
      const result = await context.service.find({
        query: { email: data.email, status: false }
      });
      // The email is found, set it as result to prevent the actual patch call on the db
      if (result.data.length) {
        context.result = result.data;
      } else {
        error("No pending confirmation", { email: data.email });
      }
    }
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg, data) {
  throw new NotFound(msg, data);
}
