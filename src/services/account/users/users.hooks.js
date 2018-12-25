// Hooks for service `optionValues`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common");
const {
  hashPassword,
  protect
} = require("@feathersjs/authentication-local").hooks;
const skipRemainingHooks = require("../../../hooks/skip-remaining-hooks");
// !code: imports
const verifyUserCreateData = require("./hooks/verify-user-create-data");
const createEmailConfirmation = require("./hooks/create-email-confirmation");
// !end

// !code: used
const { ObjectID } = require("mongodb");
// eslint-disable-next-line no-unused-vars
const { mongoKeys } = commonHooks;

// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./users.validate");
// !end

// !code: init
const foreignKeys = ["_id", "accountType", "role"];
// !end

let moduleExports = {
  before: {
    // Your hooks should include:
    //   find  : authenticate('jwt')
    //   get   : authenticate('jwt')
    //   create: hashPassword()
    //   update: hashPassword(), authenticate('jwt')
    //   patch : hashPassword(), authenticate('jwt')
    //   remove: authenticate('jwt')
    // !code: before
    all: [mongoKeys(ObjectID, foreignKeys)],
    find: [],
    get: [],
    create: [
      createEmailConfirmation(),
      validateCreate(),
      verifyUserCreateData(),
      hashPassword()
    ],
    update: [skipRemainingHooks(), validateUpdate(), hashPassword()],
    patch: [validatePatch(), hashPassword()],
    remove: []
    // !end
  },

  after: {
    // Your hooks should include:
    //   all   : protect('password') /* Must always be the last hook */
    // !<DEFAULT> code: after
    all: [protect("password") /* Must always be the last hook */],
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
