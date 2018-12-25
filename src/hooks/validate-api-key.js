const { Forbidden, BadRequest } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    const {
      params: { query }
    } = context;
    if (query.apiKey) {
      const { apiKey } = query;
      const params = { query: { key: apiKey, status: "LIVE" } };
      const records = await context.app.service("/api-keys").find(params);
      if (records.total !== 1) {
        error(`'${apiKey}' is not a valid API Key.`, BadRequest);
      } else {
        let data = records.data[0];
        data.hits++;
        await context.app.service("/api-keys").patch(data._id, data);
      }
    } else {
      error("API Key is required.");
    }
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw to reject the service call, or on an unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg, Err = Forbidden) {
  throw new Err(msg);
}
