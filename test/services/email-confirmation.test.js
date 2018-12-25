const assert = require("assert");
const app = require("../../src/app");

describe("'emailConfirmation' service", () => {
  it("registered the service", () => {
    const service = app.service("email-confirmation");

    assert.ok(service, "Registered the service");
  });
});
