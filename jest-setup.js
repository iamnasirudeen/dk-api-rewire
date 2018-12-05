// let server;
// // console.log(global); // eslint-disable-line
// const app = require('./src/app');
// const port = app.get('port');

// beforeAll(function (done) {
//   server = app.listen(port);
//   setTimeout(() => {
//     server.once('listening', () => {
//       setTimeout(() => done(), 500);
//     });
//   }, 5000);
// });

// afterAll(function () {
//   return app.service('/account-types').remove(null).then(() => {
//     server.close();
//   });
// });
