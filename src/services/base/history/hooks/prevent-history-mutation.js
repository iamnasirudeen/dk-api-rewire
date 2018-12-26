// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext } = require("feathers-hooks-common");

/**
 *
 * Does not allow users to mutate histories
 * Only get, find and create calls are allowed
 *
 */
module.exports = function() {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["find", "get", "create"]);
    return context;
  };
};
