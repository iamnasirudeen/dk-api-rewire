const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

const mailQueue = require("./mail");

module.exports = {
  mailQueue
};
