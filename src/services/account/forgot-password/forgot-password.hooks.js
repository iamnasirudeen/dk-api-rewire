// Hooks for service `forgotPassword`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
const setForgotPasswordData = require("./hooks/set-forgot-password-data");
// eslint-disable-next-line no-unused-vars
const updateUserPassword = require("./hooks/update-user-password");
// eslint-disable-next-line no-unused-vars
const verifyEmail = require("./hooks/verify-email");
// !code: imports // !end

// !code: used
// eslint-disable-next-line no-unused-vars
const { iff } = commonHooks;
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./forgot-password.validate");
// !end

// !code: init // !end

let moduleExports = {
  before: {
    // !code: before
    all: [verifyEmail(), setForgotPasswordData()],
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
    patch: [updateUserPassword()],
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
