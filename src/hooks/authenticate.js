const { authenticate } = require("@feathersjs/authentication").hooks;
const verifyIdentity = authenticate("jwt");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    try {
      return await verifyIdentity(context);
    } catch (error) {
      throw error;
    }
  };
};
