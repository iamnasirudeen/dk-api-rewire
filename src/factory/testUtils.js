const rp = require("request-promise");
const url = require("url");
const app = require("../app");
const cryptoRandomString = require("crypto-random-string");

const port = app.get("port") || 3030;
let testUsername = "Anonymous";

const getUrl = (pathname, query) =>
  url.format({
    hostname: app.get("host") || "localhost",
    protocol: "http",
    port,
    pathname,
    query
  });

const findTestUser = async email => {
  const result = await app.service("/users").find({
    query: {
      email
    }
  }); //eslint-disable-line
  return result.data[0];
};
const createTestUser = async (
  email,
  password,
  role = "Basic User",
  accType = "Individual",
  username = cryptoRandomString(8),
  skipCheck = [false, false, false]
) => {
  const user = !skipCheck[0] && (await findTestUser(app, email));
  // console.log(user); // eslint-disable-line
  if (user && user._id && !skipCheck[0]) {
    return user;
  }
  // Sets the username, caller can set too
  testUsername = username;
  // Find the actual role

  let roleResult =
    !skipCheck[1] &&
    (await app.service("/roles").find({
      query: {
        name: role
      }
    }));
  // Create Role if not found, use if found
  if (!skipCheck[1] && roleResult.total) {
    roleResult = roleResult.data[0];
  } else {
    roleResult = await app.service("/roles").create({
      name: role
    });
  }
  const { _id: roleId } = roleResult;
  // Find account type
  let accTypeResult =
    !skipCheck[2] &&
    (await app.service("/account-types").find({
      query: {
        name: accType,
        published: true
      }
    }));
  // Create if not found, use if found
  if (!skipCheck[2] && accTypeResult.total) {
    accTypeResult = accTypeResult.data[0];
  } else {
    accTypeResult = await app.service("/account-types").create({
      name: accType,
      published: true
    });
  }
  const { _id: accountTypeId } = accTypeResult;

  return await app.service("/users").create({
    username: testUsername,
    email,
    password,
    dateOfBirth: "1980-01-01",
    fosta: true,
    roleId: roleId.toString(),
    ip: "156.130.112.155",
    deletedAt: -1,
    accountTypeId: accountTypeId.toString()
  });
};

const clientAuthenticate = (email, password) => {
  return rp({
    // Authenticate user
    url: getUrl("/authentication"),
    json: true,
    method: "POST",
    body: {
      email,
      password,
      strategy: "local"
    }
  }).then(res => {
    return res.accessToken;
  });
};

const clientLogout = accessToken => {
  return rp({
    // Authenticate user
    url: getUrl("/authentication"),
    json: true,
    method: "DELETE",
    body: {
      accessToken,
      strategy: "local"
    }
  }).then(res => {
    return res;
  });
};

module.exports = {
  getUrl,
  createTestUser,
  clientAuthenticate,
  clientLogout
};
