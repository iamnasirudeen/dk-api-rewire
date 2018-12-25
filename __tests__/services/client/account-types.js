// const assert = require('assert');
const expect = require("expect");
const rp = require("request-promise");
const url = require("url");
const app = require("../../../src/app");
const utils = require("../../../src/factory/testUtils");

let role;
const testData = {
  // eslint-disable-line
  name: "testRole",
  published: true
};

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
let superToken = "";
let superData = {
  name: "superName",
  published: true
};
const password = "tester"; // eslint-disable-line

const createSuperAdminData = async () => {
  role = "Super Admin";
  // Create the user
  await utils.createTestUser(
    superAdminEmail,
    password,
    role,
    "Individual",
    superAdminUsername,
    [true, true, true]
  );
  // log the user in
  superToken = await utils.clientAuthenticate(superAdminEmail, password);
  headers.Authorization = superToken;
  // Create a new resource
  superData = await makeClientRequest("/account-types", "POST", superData);
};

describe("User Account Types", () => {
  // Create Role
  // Create Account Type
  // Create test user
  beforeAll(async () => {
    await app.service("/roles").remove(null);
    await app.service("/account-types").remove(null);
    await app.service("/users").remove(null);
    await createSuperAdminData();
  });
  afterEach(async () => {
    await app.service("/users").remove(null);
    role = "Basic User";
  });

  it("Super Admin Can Add/Manage Account Type", async () => {
    const result = superData;
    expect(superData.name).toBe(result.name);
    result.name = "_MODIFIED_";
    // Update the resource
    let path = `/account-types/${result._id}`;
    const _result = await makeClientRequest(path, "PUT", result);
    expect(result.name).toBe(_result.name);
    expect(result.createdAt.toString()).toBe(_result.createdAt.toString());
    // Patch The resource
    _result.name = "__MODIFIED__";
    const __result = await makeClientRequest(path, "PATCH", _result);
    expect(_result.name).toBe(__result.name);
    // Deletes the resource
    const ___result = await makeClientRequest(path, "DELETE", _result);
    expect(___result.name).toBeTruthy();
  });

  // Admin is a super set of mods and user, this test covers for the rest of the roles
  it("Admin Can Not Add/Manage Account Type", () => {
    role = "Admin";
    // Create the user
    return utils
      .createTestUser(adminEmail, password, role, "Individual", adminUsername, [
        false,
        false,
        false
      ])
      .then(() => {
        // log the user in
        return utils.clientAuthenticate(adminEmail, password).then(token => {
          headers.Authorization = token;
          // Create a new resource
          return makeClientRequest("/account-types", "POST", testData).catch(
            res => {
              expect(res.error.code).toBe(403);
              expect(res.error.message).toBe(
                "Admin cannot create Account Types"
              );
              expect(res.error.name).toBe("Forbidden");
              let path = `/account-types/${superData._id}`;
              superData.name = "_MODIFIED_";
              return makeClientRequest(path, "PUT", superData).catch(res => {
                expect(res.error.code).toBe(403);
                expect(res.error.message).toBe(
                  "Admin cannot update Account Types"
                );
                expect(res.error.name).toBe("Forbidden");

                return makeClientRequest(path, "DELETE").catch(res => {
                  expect(res.error.code).toBe(403);
                  expect(res.error.message).toBe(
                    "Admin cannot remove Account Types"
                  );
                  expect(res.error.name).toBe("Forbidden");
                });
              });
            }
          );
        });
      });
  });
});
