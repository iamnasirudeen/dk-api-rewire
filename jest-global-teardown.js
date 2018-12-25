const app = require("./src/app");
module.exports = async () => {
  // console.log
  app.get("server").close();
  // process.exit(1);
};
