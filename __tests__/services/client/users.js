/* eslint-disable- */
const expect = require("expect");
const rp = require("request-promise");
const url = require("url");
const app = require("../../../src/app");
const utils = require("../../../src/factory/testUtils");
let path = "/users";
let role;
const testData = {
  // eslint-disable-line
  name: "testRole"
};

// A user can create an account
// Throws if schema is not valid on creation
// Current user update account
// Current user patch account
// Current user can not remove account
// Mod user can update/patch account
// Mod user can not delete account
// One of other mods user can not update user
// Super admin can deactivate account
// Super admin can permanently delete account

const query = {};
const headers = {};
const port = app.get("port") || 3030;
const getUrl = pathname =>
  url.format({
    // eslint-disable-line
    hostname: app.get("host") || "localhost",
    protocol: "http",
    port,
    pathname,
    query
  });

const makeClientRequest = (path, method = "GET", body = {}) => {
  return rp({
    url: getUrl(path),
    json: true,
    method,
    body,
    headers
  });
};

const basicUsername = "BasicUser"; // eslint-disable-line
const basicUserEmail = "BasicUser@email.com"; // eslint-disable-line
const usersModUsername = "UsersMod"; // eslint-disable-line
const usersModEmail = "UsersMod@email.com"; // eslint-disable-line
const postsModUsername = "PostsMod"; // eslint-disable-line
const postsModEmail = "PostsMod@email.com"; // eslint-disable-line
const mediaModUsername = "MediaMod"; // eslint-disable-line
const mediaModEmail = "MediaMod@email.com"; // eslint-disable-line
const adminUsername = "Admin"; // eslint-disable-line
const adminEmail = "admin@email.com"; // eslint-disable-line
const superAdminUsername = "SuperAdmin"; // eslint-disable-line
const superAdminEmail = "SuperAdmin@email.com"; // eslint-disable-line
let basicUserToken = "";
let basicUserData;

const password = "tester"; // eslint-disable-line

// Creates a basic user that can be used in the test cases
const createBasicUserData = async () => {
  role = "Basic User";
  // Create the user
  basicUserData = await utils.createTestUser(
    basicUserEmail,
    password,
    role,
    "Individual",
    basicUsername,
    [false, false, false]
  );
  // log the user in
  basicUserToken = await utils.clientAuthenticate(basicUserEmail, password);
  headers.Authorization = basicUserToken;
};

describe("Users", () => {
  // Create Role
  // Create Account Type
  // Create test user
  beforeAll(async () => {
    await app.service("/roles").remove(null);
    await app.service("/account-types").remove(null);
    await app.service("/users").remove(null);
    await createBasicUserData();
  });
  afterEach(async () => {
    await app.service("/users").remove(null);
    role = "Basic User";
  });

  test("should be successful on created with hashed password", () => {
    const userData = {
      username: "Rocio.Stol",
      email: "Kelsi7@yahoo.com",
      password: "ncE8a29AeGHa2AB",
      roleId: basicUserData.roleId.toString(),
      accountTypeId: basicUserData.accountTypeId.toString(),
      fosta: true,
      dateOfBirth: "2013-01-29",
      ip: "156.130.112.155",
      deletedAt: -1
    };
    // Remove authorization as it is not needed
    headers.Authorization = "";
    return makeClientRequest("/users", "POST", userData).then(result => {
      expect(userData.username).toBe(result.username);
      expect(userData.email).toBe(result.email);
      expect(userData.roleId).toBe(result.roleId);
      expect(userData.accountTypeId).toBe(result.accountTypeId);
      expect(userData.fosta).toBe(result.fosta);
      expect(userData.password).not.toBe(result.username);
    });
  });

  test("should be throw when data is not valid", () => {
    const userData = {};
    headers.Authorization = "";
    return makeClientRequest("/users", "POST", userData).catch(result => {
      expect(result.error).toMatchSnapshot();
    });
  });
  describe("Basic User", () => {
    beforeEach(async () => {
      await createBasicUserData();
    });
    afterEach(async () => {
      await app.service("/users").remove(null);
      role = "Basic User";
    });
    test("should update, patch, delete account", () => {
      headers.Authorization = basicUserToken;
      basicUserData.username = "_MODIFIED_";
      path = `/users/${basicUserData._id}`;
      return makeClientRequest(path, "PUT", basicUserData).then(result => {
        expect(Object.keys(result)).toMatchSnapshot();
        basicUserData.userData = "__MODIFIED__";
        return makeClientRequest(path, "PATCH", basicUserData).then(_result => {
          expect(Object.keys(_result)).toMatchSnapshot();
          return makeClientRequest(path, "DELETE").then(_result => {
            expect(Object.keys(_result)).toMatchSnapshot();
          });
        });
      });
    });
    test("should not patch other users", () => {
      // Test if basic user can update other users
      return utils
        .createTestUser(
          mediaModEmail,
          password,
          role,
          "Individual",
          mediaModUsername,
          [false, false, false]
        )
        .then(data => {
          path = `/users/${data._id}`;
          return makeClientRequest(path, "PATCH", data).catch(res => {
            const msg = `You are not allowed to 'patch' 'Users' with '${
              data._id
            }'`;
            expect(res.error.code).toBe(403);
            expect(res.error.message).toBe(msg);
            expect(res.error.name).toBe("Forbidden");
          });
        });
    });
    test("should not update other users", () => {
      // Test if basic user can update other users
      return utils
        .createTestUser(
          mediaModEmail,
          password,
          role,
          "Individual",
          mediaModUsername,
          [false, false, false]
        )
        .then(data => {
          path = `/users/${data._id}`;
          return makeClientRequest(path, "PUT", data).catch(res => {
            const msg = `You are not allowed to 'update' 'Users' with '${
              data._id
            }'`;
            expect(res.error.code).toBe(403);
            expect(res.error.message).toBe(msg);
            expect(res.error.name).toBe("Forbidden");
          });
        });
    });
    test("should not DELETE other users", () => {
      // Test if basic user can update other users
      return utils
        .createTestUser(
          mediaModEmail,
          password,
          role,
          "Individual",
          mediaModUsername,
          [false, false, false]
        )
        .then(data => {
          path = `/users/${data._id}`;
          return makeClientRequest(path, "DELETE").catch(res => {
            const msg = `You are not allowed to 'remove' 'Users' with '${
              data._id
            }'`;
            expect(res.error.code).toBe(403);
            expect(res.error.message).toBe(msg);
            expect(res.error.name).toBe("Forbidden");
          });
        });
    });
  });

  describe("Users Moderator", () => {
    beforeEach(async () => {
      await createBasicUserData();
    });
    afterEach(async () => {
      await app.service("/users").remove(null);
      role = "Basic User";
    });
    test("should update other users", () => {
      role = "Users Moderator";
      // Test if basic user can update other users
      return utils
        .createTestUser(
          usersModEmail,
          password,
          role,
          "Individual",
          usersModUsername,
          [false, false, false]
        )
        .then(() => {
          return utils
            .clientAuthenticate(usersModEmail, password)
            .then(token => {
              headers.Authorization = token;
              basicUserData.username = "_MODIFIED_";
              path = `/users/${basicUserData._id}`;
              return makeClientRequest(path, "PUT", basicUserData).then(res => {
                expect(Object.keys(res)).toMatchSnapshot();
              });
            });
        });
    });
    test("should delete other users", () => {
      role = "Users Moderator";
      // Test if basic user can update other users
      return utils
        .createTestUser(
          usersModEmail,
          password,
          role,
          "Individual",
          usersModUsername,
          [false, false, false]
        )
        .then(() => {
          return utils
            .clientAuthenticate(usersModEmail, password)
            .then(token => {
              headers.Authorization = token;
              path = `/users/${basicUserData._id}`;
              return makeClientRequest(path, "DELETE", basicUserData).then(
                res => {
                  expect(Object.keys(res)).toMatchSnapshot();
                }
              );
            });
        });
    });
  });
});
