/* eslint-disable no-console */
// Start the server. (Can be re-generated.)
// !code: preface
require("dotenv-flow").config();
// !end
const logger = require("./logger");
const app = require("./app");
const seedData = require("./seed-data");
// !code: imports // !end
// !code: init // !end

const port = process.env.PORT || app.get("port");
const server = app.listen(port);
// !code: init2
const initDataSeeder = require("./init-data-seeder");
// !end

process.on("unhandledRejection", (reason, p) => {
  // !code: unhandled_rejection_log
  console.log(reason);
  logger.error("Unhandled Rejection at: Promise ", p, reason);
  // !end
  // !code: unhandled_rejection // !end
});

server.on("listening", async () => {
  // !<DEFAULT> code: listening_log
  logger.info(
    "Feathers application started on http://%s:%d",
    app.get("host"),
    port
  );
  // !end
  // !code: listening
  const host = app.get("host");
  let swaggerConfig = require("./../public/swagger-ui/config.v1.json");
  if (swaggerConfig.host !== host) {
    swaggerConfig.host = host;
    require("fs").writeFile(
      `${process.cwd()}/public/swagger-ui/config.v1.json`,
      JSON.stringify(swaggerConfig),
      err => {
        if (err) throw err;
      }
    );
  }
  // !end
  await seedData(app);
  // !code: listening1
  setTimeout(async () => {
    if (["development", "production"].includes(process.env.NODE_ENV)) {
      await initDataSeeder(app);
    }
  }, 500);
  // !end
});

// !code: funcs // !end
// !code: end // !end
