const preventHistoryMutation = require('./hooks/prevent-history-mutation');
// !code: imports // !end

// !code: used
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require('./history.validate');
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !code: before
    all: [preventHistoryMutation()],
    find: [],
    get: [],
    create: [validateCreate()],
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
    // !<DEFAULT> code: error
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
    // !end
  },
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
