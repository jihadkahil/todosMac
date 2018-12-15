var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};




//Very important note about Node js:
// we have 3 enviroment:
// 1-Production.
// 2-test.
// 3 development.
