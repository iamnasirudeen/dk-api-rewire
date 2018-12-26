// project/src/services/posts/posts.hooks.js
const { fastJoin, makeCallingParams } = require("feathers-hooks-common");
const BatchLoader = require("@feathers-plus/batch-loader");
const { getResultsByKey, getUniqueKeys } = BatchLoader;

const commentResolvers = {
  joins: {
    author: () => async (comment, context) =>
      !comment.userId
        ? null
        : (comment.userRecord = await context._loaders.user.id.load(
          comment.userId
        ))
  }
};
const postResolvers = {
  before: (context) => {
    context._loaders = { user: {}, comments: {} };
    const users = {};
    context._loaders.user.id = new BatchLoader(
      async (keys, context) => {
        const result = await users.find(
          makeCallingParams(
            context,
            { id: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false }
          )
        );
        return getResultsByKey(keys, result, (user) => user.id, "!");
      },
      { context }
    );

    context._loaders.comments.postId = new BatchLoader(
      async (keys, context) => {
        const comments = {};
        const result = await comments.find(
          makeCallingParams(
            context,
            { postId: { $in: getUniqueKeys(keys) } },
            undefined,
            { paginate: false }
          )
        );
        return getResultsByKey(
          keys,
          result,
          (comment) => comment.postId,
          "[!]"
        );
      },
      { context }
    );
  },
  joins: {
    author: () => async (post, context) =>
      (post.userRecord = await context._loaders.user.id.load(post.userId)),

    starers: () => async (post, context) =>
      !post.starIds
        ? null
        : (post.starIdsRecords = await context._loaders.user.id.loadMany(
          post.starIds
        )),

    comments: {
      // eslint-disable-next-line
      resolver: (...args) => async (post, context) =>
        (post.commentRecords = await context._loaders.comments.postId.load(
          post.id
        )),

      joins: commentResolvers
    }
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
  after: {
    // eslint-disable-next-line
    all: [fastJoin(postResolvers, (context) => query)]
  }
};
// Original record
[
  {
    id: 1,
    body: "John post",
    userId: 101,
    starIds: [102, 103, 104],
    reputation: [
      // The `populate` hook cannot handle this structure.
      { userId: 102, points: 1 },
      { userId: 103, points: 1 },
      { userId: 104, points: 1 }
    ]
  }
];

// Results
// eslint-disable-next-line
const result = [
  {
    id: 1,
    body: "John post",
    userId: 101,
    starIds: [102, 103, 104],
    reputation: [
      { userId: 102, points: 1, author: "Marshall" },
      { userId: 103, points: 1, author: "Barbara" },
      { userId: 104, points: 1, author: "Aubree" }
    ],
    author: { id: 101, name: "John" },
    comments: [
      {
        id: 11,
        text: "John post Marshall comment 11",
        postId: 1,
        userId: 102,
        author: { id: 102, name: "Marshall" }
      },
      {
        id: 12,
        text: "John post Marshall comment 12",
        postId: 1,
        userId: 102,
        author: { id: 102, name: "Marshall" }
      },
      {
        id: 13,
        text: "John post Marshall comment 13",
        postId: 1,
        userId: 102,
        author: { id: 102, name: "Marshall" }
      }
    ],
    starers: [
      { id: 102, name: "Marshall" },
      { id: 103, name: "Barbara" },
      { id: 104, name: "Aubree" }
    ]
  }
];
