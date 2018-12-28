// Hooks for service `options`. (Can be re-generated.)
const commonHooks = require("feathers-hooks-common");
// !code: imports // !end

// !code: used
// eslint-disable-next-line no-unused-vars
const { ObjectID } = require("mongodb");
const { mongoKeys, cache, fastJoin, makeCallingParams } = commonHooks;
const CacheMap = require("@feathers-plus/cache");
// Create a cache for a maximum of 100 users
const cacheMapValues = CacheMap({ max: 100 });
const cacheMapAccountType = CacheMap({ max: 100 });
// eslint-disable-next-line no-unused-vars
const {
  validateCreate,
  validateUpdate,
  validatePatch
} = require("./options.validate");

const BatchLoader = require("@feathers-plus/batch-loader");
const { getResultsByKey, getUniqueKeys } = BatchLoader;

const optionValuesResolver = async (keys, context) => {
  const optionValueService = context.app.service("/option/:optionId/values");
  const result = await optionValueService.find(
    makeCallingParams(
      {},
      {
        optionId: { $in: getUniqueKeys(keys) },
        $select: [
          "_id",
          "name",
          "optionId",
          "shortName",
          "longName",
          "displayOrder",
          "accountTypeIds"
        ]
      },
      undefined,
      {
        paginate: false,
        provider: null
      }
    )
  );
  return getResultsByKey(keys, result, value => value.optionId, "[!]");
};

const accountTypeLoader = async (keys, context) => {
  const accountTypeService = context.app.service("/account-types");
  const result = await accountTypeService.find(
    makeCallingParams(
      {},
      {
        _id: { $in: getUniqueKeys(keys) },
        published: true,
        $select: ["_id", "name", "shortName", "longName", "displayOrder"]
      },
      undefined,
      {
        paginate: false,
        provider: null
      }
    )
  );
  return getResultsByKey(keys, result, accountType => accountType._id, "!");
};

const accountTypeResolvers = {
  joins: {
    accountTypes: () => async (value, context) =>
      (value.accountTypes = await context._loaders.optionValues.accountTypeIds.loadMany(
        value.accountTypeIds
      ))
  }
};

const optionResolvers = {
  before: context => {
    context._loaders = { optionValues: {} };
    context._loaders.optionValues.optionId = new BatchLoader(
      optionValuesResolver,
      {
        context,
        cacheMap: cacheMapValues
      }
    );
    context._loaders.optionValues.accountTypeIds = new BatchLoader(
      accountTypeLoader,
      {
        context,
        cacheMap: cacheMapAccountType
      }
    );
  },
  joins: {
    values: {
      resolver: () => async (option, context) =>
        (option.values = await context._loaders.optionValues.optionId.load(
          option._id
        )),
      joins: accountTypeResolvers
    }
  }
};
// !end

// !code: init
const foreignKeys = ["_id", "userId"];
const query = {
  // values: {
  //   args: null,
  //   accountTypes: [["_id", "name"]]
  // }
  values: {
    args: [["_id", "name"]],
    accountTypes: [["_id", "name"]]
  }
};
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
    // !code: after
    all: [fastJoin(optionResolvers, () => query)],
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
