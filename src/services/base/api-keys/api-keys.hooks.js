const setApiKeyData = require("./hooks/set-api-key-data");

const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./api-keys.validate");

// !code: init // !end

let moduleExports = {
  before: {
    // !code: before
    all: [],
    find: [],
    get: [],
    create: [setApiKeyData(), validateCreate()],
    update: [validateUpdate()],
    patch: [validatePatch()],
    remove: []
    // !end
  },

  after: {
    // !code: after
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
    // !code: error
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
