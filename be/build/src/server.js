"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _cors2 = require("./config/cors");
var _environment = require("./config/environment");
var _mongodb = require("./config/mongodb");
var _v = require("./routes/v1");
// Import from config

// Import from routes

var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/v1', (0, _cors["default"])(_cors2.corsOptions), _v.apiV1);
(0, _mongodb.connectDB)().then(function () {
  console.log('Database is connected');
  app.listen(process.env.PORT || _environment.env.APP_PORT, function () {
    // eslint-disable-next-line no-console
    console.log("Hello FSN, I'm running at port: ".concat(process.env.PORT || _environment.env.APP_PORT));
  });
});