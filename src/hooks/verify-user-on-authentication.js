// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { Forbidden } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // This is the one place to do verification on the user after authentication

    // User is populated after authentication in the context's params
    const { user } = context.params;
    // Do a get service call on the user's emailConfirmId
    const emailConfirmResult = await context.app
      .service("/email-confirmation")
      .get(user.emailConfirmId);
    // If the status is false, throw an error.
    if (!emailConfirmResult.status) {
      throw new Forbidden("Email not confirmed");
    }

    // Best practice: hooks should always return the context.
    return context;
  };
};
