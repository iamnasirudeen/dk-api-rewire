// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const cryptoRandomString = require("crypto-random-string");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["create"]);

    // Get the record(s) from context.data (before), context.result.data or context.result (after).

    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    /*
    Modify records and/or context.
     */
    if (Array.isArray(records)) {
      records.map(async record => {
        record.emailConfirm = await createEmailConfirmation(record, context);
        return record;
      });
    } else {
      records.emailConfirm = await createEmailConfirmation(records, context);
    }
    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

async function createEmailConfirmation(record, context) {
  const createData = {
    key: cryptoRandomString(20),
    status: false,
    email: record.email,
    username: record.username,
    deletedAt: -1
  };
  const result = await context.app
    .service("/email-confirmation")
    .create(createData);
  return result._id.toString();
}
// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
