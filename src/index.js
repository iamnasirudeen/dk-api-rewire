/* eslint-disable no-console */
// Start the server. (Can be re-generated.)
// !code: preface // !end
const logger = require('./logger');
const app = require('./app');
const seedData = require('./seed-data');
// !code: imports // !end
// !code: init // !end

const port = process.env.PORT || app.get('port');
const server = app.listen(port);
// !code: init2
const initDataSeeder = require('./init-data-seeder');
// !end

process.on('unhandledRejection', (reason, p) => {
  // !code: unhandled_rejection_log
  console.log(reason);
  logger.error('Unhandled Rejection at: Promise ', p, reason);
  // !end
  // !code: unhandled_rejection // !end
});

server.on('listening', async () => {
  // !<DEFAULT> code: listening_log
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
  // !end
  // !code: listening
  setTimeout(() => {
    if (['development', 'production'].includes(process.env.NODE_ENV)) {
      initDataSeeder(app);
    }
  }, 500);
  // !end
  await seedData(app);
  // !code: listening1 // !end
});

// !code: funcs // !end
// !code: end // !end
