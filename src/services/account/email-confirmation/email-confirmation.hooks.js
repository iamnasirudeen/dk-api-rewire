// Hooks for service `emailConfirmation`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common"); // eslint-disable-line
// eslint-disable-next-line no-unused-vars
const restrictUpdateAndRemove = require("./hooks/restrict-update-and-remove");
// !code: imports // !end

// !code: used
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./email-confirmation.validate");
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !code: before
    all: [restrictUpdateAndRemove()],
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
