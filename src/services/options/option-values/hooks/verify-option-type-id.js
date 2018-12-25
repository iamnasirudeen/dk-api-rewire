// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const { BadRequest } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
    ]);

    let optionId = context.params.route.optionId;
    try {
      // eslint-disable-next-line
      const optionResult = await context.app.service("/options").get(optionId);
    } catch (e) {
      error(`'${optionId}' is not a valid optionId`);
    }
    const { method } = context;
    if (["remove", "patch", "update", "find"].includes(method)) {
      if (!context.params.query) {
        context.params.query = {};
      }
      context.params.query.option = { $eq: optionId };
      context.params.query.$sort = { displayOrder: 1 };
    } else if (method === "create") {
      let records = getItems(context);
      records.optionId = optionId;
      if (Array.isArray(records)) {
        records.map(rec => {
          rec.option = optionId;
          return rec;
        });
      } else {
        records.option = optionId;
      }
      replaceItems(context, records);
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
