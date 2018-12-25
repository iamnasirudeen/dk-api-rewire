const app = require("./src/app");
const port = app.get("port");

module.exports = async () => {
  // eslint-disable-next-line
  console.info(
    "If the tests are failing or the server is not starting, try killing all node process and run test command again."
  );
  const server = app.listen(port);
  app.set("server", server);
};
