const utils = require("./../factory/utils");
// eslint-disable-next-line no-unused-vars
module.exports = () => {
  return ctx => {
    const authPath = ctx.app.get("authentication").path;
    // const params = ctx.params;
    // console.log(params && params.$ignoreDeletedAt) // eslint-disable-line

    const protectedPathTest = utils.isProtectedPath(ctx);
    const userCreateFindTest =
      ["create", "find"].includes(ctx.method) && ctx.path === "users";
    const authPathTest = authPath === `/${ctx.path}`;
    const optionFindTest = ctx.path === "options" && ctx.method === "find";
    const accTypeFindTest =
      ctx.path === "account-types" && ctx.method === "find";
    const roleFindTest = ctx.path === "roles" && ctx.method === "find";
    // Checks if the omitPaths || authPath is not same as the ctxPath
    return (
      !authPathTest &&
      !protectedPathTest &&
      !userCreateFindTest &&
      !optionFindTest &&
      !accTypeFindTest &&
      !roleFindTest
    );
    // Runs the set of hooks attached to the when hook if the condition is met.
  };
};
