const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;
const skipRemainingHooks = require('../../../hooks/skip-remaining-hooks');
// !code: imports // !end

// !code: used
// eslint-disable-next-line no-unused-vars
// const {
//   iff
// } = commonHooks;
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require('./users.validate');
// !end

// !code: init // !end

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
    all: [],
    find: [],
    get: [],
    create: [validateCreate(), hashPassword()],
    update: [skipRemainingHooks(), validateUpdate(), hashPassword()],
    patch: [validatePatch(), hashPassword()],
    remove: []
    // !end
  },

  after: {
    // Your hooks should include:
    //   all   : protect('password') /* Must always be the last hook */
    // !<DEFAULT> code: after
    all: [protect('password') /* Must always be the last hook */ ],
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
