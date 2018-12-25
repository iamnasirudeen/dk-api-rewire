const assert = require("assert");
const expect = require("expect");
const rp = require("request-promise");
const url = require("url");
const app = require("../src/app");

const port = app.get("port") || 3030;
const getUrl = pathname =>
  url.format({
    hostname: app.get("host") || "localhost",
    protocol: "http",
    port,
    pathname
  });

describe("Feathers application tests", () => {
  it("starts and shows the index page", () => {
    return rp(getUrl()).then(body =>
      assert.ok(
        body.indexOf("<html>") !== -1,
        "response does not contain <html>"
      )
    );
  });

  describe("404", function() {
    it("shows a 404 HTML page", () => {
      return rp({
        url: getUrl("path/to/nowhere"),
        headers: {
          Accept: "text/html"
        }
      }).catch(res => {
        assert.strictEqual(res.statusCode, 404, "unexpected statusCode");
        assert.ok(
          res.error.indexOf("<html>") !== -1,
          "error does not contain <html>"
        );
      });
    });

    it("shows a 404 JSON error without stack trace", () => {
      return rp({
        url: getUrl("path/to/nowhere"),
        json: true
      }).catch(res => {
        assert.strictEqual(res.statusCode, 404, "unexpected statusCode");
        assert.strictEqual(res.error.code, 404, "unexpected error.code");
        assert.strictEqual(
          res.error.message,
          "Page not found",
          "unexpected error.message"
        );
        assert.strictEqual(res.error.name, "NotFound", "unexpected error.name");
      });
    });
  });

  describe("Authentication", function() {
    beforeEach(async () => {
      await app.service("/users").remove(null);
      await app.service("/roles").remove(null);
      await app.service("/account-types").remove(null);
    });
    test("should not be called when creating users", async () => {
      // Generate role
      const { _id: roleId } = await app.service("/roles").create({
        name: "Admin"
      });
      // Generate Account Type
      const { _id: accountTypeId } = await app
        .service("/account-types")
        .create({
          name: "Individual",
          published: true
        });
      // User payload
      const payload = {
        username: "Rocio.Stol",
        email: "Kelsi7@yahoo.com",
        password: "ncE8a29AeGHa2AB",
        roleId: roleId,
        accountTypeId: accountTypeId,
        fosta: true,
        dateOfBirth: "2013-01-29",
        ip: "156.130.112.155",
        deletedAt: -1
      };
      // Create user
      return rp({
        url: getUrl("/users"),
        json: true,
        method: "POST",
        body: payload
      }).then(result => {
        // Tests the user
        expect(payload.username).toBe(result.username);
        expect(payload.email).toBe(result.email);
        expect(payload.roleId.toString()).toBe(result.roleId);
        expect(payload.accountTypeId.toString()).toBe(result.accountTypeId);
        return rp({
          // Authenticate user
          url: getUrl("/authentication"),
          json: true,
          method: "POST",
          body: {
            email: payload.email,
            password: payload.password,
            strategy: "local"
          }
        }).then(res => {
          // Assert authentication
          expect(res.accessToken).toBeDefined();
        });
      });
    });
    test("should not be called when creating users", async () => {
      // Create user
      return rp({
        url: getUrl("/users"),
        json: true,
        method: "GET"
      }).catch(res => {
        assert.strictEqual(res.error.code, 401, "unexpected error.code");
        assert.strictEqual(
          res.error.message,
          "No auth token",
          "unexpected error.message"
        );
        assert.strictEqual(
          res.error.name,
          "NotAuthenticated",
          "unexpected error.name"
        );
      });
    });
  });
});
