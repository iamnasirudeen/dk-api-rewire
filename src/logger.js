// Logger. (Can be re-generated.)
const {
  createLogger,
  format,
  transports
} = require('winston');
// !code: imports
require('winston-mongodb');
// !end
// !code: init // !end

// Configure the Winston logger. For the complete documentation seee https://github.com/winstonjs/winston
const moduleExports = createLogger({
  // !code: level
  // To see more detailed errors, change this to debug'
  level: 'info',
  // !end
  // !<DEFAULT> code: format
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  // !end
  // !<DEFAULT> code: transport
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      level: 'debug',
      db: 'mongodb://super:UmIttuvreonCad1@ds117858.mlab.com:17858/dating_kinky_api'
    })
  ],
  // !end
  // !code: moduleExports // !end
});
// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end