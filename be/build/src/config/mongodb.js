"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDB = exports.connectDB = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("mongodb");
var _environment = require("./environment");
// Import from env

var dbInstance = null;
var connectDB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var client;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          client = new _mongodb.MongoClient(_environment.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
          }); // Connect the client to the server
          _context.next = 3;
          return client.connect();
        case 3:
          // Assign clientDB to our dbInstance
          dbInstance = client.db(_environment.env.DATABASE_NAME);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function connectDB() {
    return _ref.apply(this, arguments);
  };
}();

// Get Database Instance
/**
 *
 * @returns {Db}
 */
exports.connectDB = connectDB;
var getDB = function getDB() {
  if (!dbInstance) throw new Error('Must connect to Database first!');
  return dbInstance;
};
exports.getDB = getDB;