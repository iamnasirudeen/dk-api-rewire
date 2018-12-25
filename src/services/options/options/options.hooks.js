// Hooks for service `options`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common");
// !code: imports // !end

// !code: used
// eslint-disable-next-line no-unused-vars
const { ObjectID } = require("mongodb");
const { mongoKeys } = commonHooks;
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./options.validate");
// !end

// !code: init
const foreignKeys = ["_id", "author"];
// !end

let moduleExports = {
  before: {
    // !code: before
    all: [mongoKeys(ObjectID, foreignKeys)],
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
