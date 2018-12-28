// Hooks for service `optionValues`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
const verifyOptionTypeId = require("./hooks/verify-option-type-id");
// !code: imports // !end

// !code: used
const { ObjectID } = require("mongodb");
// eslint-disable-next-line no-unused-vars
const { mongoKeys, iff, isProvider } = commonHooks;
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./option-values.validate");
// !end

// !code: init
const foreignKeys = ["_id", "author", "option", "accountTypes"];
// !end

let moduleExports = {
  before: {
    // !code: before
    all: [
      iff(isProvider("external"), verifyOptionTypeId()),
      mongoKeys(ObjectID, foreignKeys)
    ],
    find: [],
    get: [],
    create: [validateCreate()],
    update: [validateUpdate()],
    patch: [validatePatch()],
    remove: []
    // !end
  },

  after: {
    // !<DEFAULT> code: after
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },

  error: {
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  }
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
