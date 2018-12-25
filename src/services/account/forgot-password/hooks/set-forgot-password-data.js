// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
  isProvider
} = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
const cryptoRandomString = require("crypto-random-string");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["find", "get", "create", "patch", "remove"]);

    // getItems always returns an array to simplify your processing.
    let records = getItems(context);
    // store the password in the context to retrieve later for updating the user
    if (isProvider("external")(context)) {
      context._user_ = {
        query: { email: context.params.query.email },
        data: { password: context.data.password }
      };
    }
    /*
    Modify records and/or context.
     */
    if (context.method === "patch") {
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
    if (context.method === "create") {
      const userService = context.app.service("/users");
      records = Array.isArray(records)
        ? records.map(async r => await setCreateData(r, userService))
        : await setCreateData(records, userService);
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

const setCreateData = async (r, userService) => {
  const result = (await userService.find({ query: { email: r.email } }))
    .data[0];
  return {
    email: r.email,
    username: result.username,
    key: cryptoRandomString(20),
    deletedAt: -1,
    status: false
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new NotFound(msg);
}
