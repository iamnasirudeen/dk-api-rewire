const mongoose = require("mongoose");
console.log("Clearing Test Database...."); // eslint-disable-line

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/dating_kinky_api_test")
  .then(({ connection }) => {
    // eslint-disable-next-line no-console
    connection.db.dropDatabase().then(() => {
      console.log("Cleared Test Database...."); // eslint-disable-line
      connection.close();
    });
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  });
