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
const { mongoKeys, cache, fastJoin, makeCallingParams } = commonHooks;
const BatchLoader = require("@feathers-plus/batch-loader");
const { getResultsByKey, getUniqueKeys } = BatchLoader;
// const CacheMap = require("@feathers-plus/cache");

const roleLoader = async (keys, context) => {
  const roleService = context.app.service("/roles");
  const result = await roleService.find(
    makeCallingParams({}, { _id: { $in: getUniqueKeys(keys) } }, undefined, {
      paginate: false
    })
  );
  return getResultsByKey(keys, result, role => role._id, "!");
};
// const roleBatchLoader = new BatchLoader(roleLoader);

const accountTypeLoader = async (keys, context) => {
  const accountTypeService = context.app.service("/account-types");
  const result = await accountTypeService.find(
    makeCallingParams({}, { _id: { $in: getUniqueKeys(keys) } }, undefined, {
      paginate: false,
      params: { provider: null }
    })
  );
  return getResultsByKey(keys, result, accountType => accountType._id, "!");
};

const userResolvers = {
  before: context => {
    context._loaders = { role: {}, accountType: {} };
    // console.log(context.params);
    context._loaders.role.id = new BatchLoader(
      roleLoader,
      { context },
      { params: { provider: null } }
    );
    context._loaders.accountType.id = new BatchLoader(
      accountTypeLoader,
      {
        context
      },
      { params: { provider: null } }
    );
  },
  joins: {
    role: () => async (user, context) =>
      (user.role = await context._loaders.role.id.load(user.roleId)),
    accountType: () => async (user, context) =>
      (user.accountType = await context._loaders.accountType.id.load(
        user.accountTypeId
      ))
  }
};

// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./users.validate");
// !end

// !code: init
const foreignKeys = ["_id", "accountTypeId", "roleId"];
const query = {
  role: [["_id", "name", "shortName", "longName"]],
  accountType: [["_id", "name", "shortName", "longName"]]
};
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
      validateCreate(),
      createEmailConfirmation(),
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
    // !code: after
    all: [
      fastJoin(userResolvers, query),
      /* Must always be the last hook */
      protect("password")
    ],
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
