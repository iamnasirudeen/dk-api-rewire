const { cache, fastJoin, makeCallingParams } = require("feathers-hooks-common");
const BatchLoader = require("@feathers-plus/batch-loader");
const CacheMap = require("@feathers-plus/cache");
const { getResultsByKey, getUniqueKeys } = BatchLoader;
// Create a cache for a maximum of 100 users
const cacheMapUsers = CacheMap({ max: 100 });
// Create a batchLoader using the persistent cache
const userBatchLoader = new BatchLoader(
  async (keys) => {
    const users = {};
    const result = await users.find(
      makeCallingParams({}, { id: { $in: getUniqueKeys(keys) } }, undefined, {
        paginate: false
      })
    );
    return getResultsByKey(keys, result, (user) => user.id, "!");
  },
  { cacheMap: cacheMapUsers }
);
const postResolvers = {
  before: (context) => {
    context._loaders = { user: {} };
    context._loaders.user.id = userBatchLoader;
  },
  joins: {
    author: () => async (post, context) =>
      (post.author = await context._loaders.user.id.load(post.userId)),
    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starers = await context._loaders.user.id.loadMany(post.starIds))
  }
};
const query = {
  author: true,
  starers: [["id", "name"]],
  comments: {
    args: null,
    author: [["id", "name"]]
  }
};
module.exports = {
  before: {
    all: cache(cacheMapUsers)
  },
  after: {
    all: [cache(cacheMapUsers), fastJoin(postResolvers, () => query)]
  }
};
