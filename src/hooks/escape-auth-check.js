const utils = require('./../factory/utils');
// eslint-disable-next-line no-unused-vars
module.exports = () => {
  return (ctx) => {
    const authPath = ctx.app.get('authentication').path;
    // const params = ctx.params;
    // console.log(params && params.$ignoreDeletedAt) // eslint-disable-line

    const protectedPathTest = utils.isProtectedPath(ctx);
    const userCreateTest = ctx.method === 'create' && ctx.path === 'users';
    const authPathTest = authPath === `/${ctx.path}`;
    // Checks if the omitPaths || authPath is not same as the ctxPath
    return !authPathTest && !protectedPathTest && !userCreateTest;
    // Runs the set of hooks attached to the when hook if the condition is met.
  };
};
