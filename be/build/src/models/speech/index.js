"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeechModel = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongodb = require("mongodb");
var _mongodb2 = require("../../config/mongodb");
var _speech = require("./speech.schema");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; } // Import schema
// INSERT
/**
 * Use this function to insert a speech data.
 * @param {*} data
 * @returns
 */
function insertOne(_x) {
  return _insertOne.apply(this, arguments);
} // FIND
/**
 * Use this function to find a speech by intent.
 * @param {*} intent
 */
function _insertOne() {
  _insertOne = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var validated;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _speech.SpeechSchema.validateAsync(data);
        case 3:
          validated = _context.sent;
          _context.next = 6;
          return (0, _mongodb2.getDB)().collection('speech').insertOne(validated);
        case 6:
          return _context.abrupt("return", _context.sent);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", {
            errors: _context.t0.message
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return _insertOne.apply(this, arguments);
}
function findOneByIntent(_x2) {
  return _findOneByIntent.apply(this, arguments);
} // UPDATE
/**
 * Use this function to update an existing speech.
 * @param {string} id
 * @param {*} data
 * @returns
 */
function _findOneByIntent() {
  _findOneByIntent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(intent) {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _mongodb2.getDB)().collection('speech').findOne({
            'intent': intent
          });
        case 3:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", {
            errors: _context2.t0.message
          });
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return _findOneByIntent.apply(this, arguments);
}
function updateOneById(_x3, _x4) {
  return _updateOneById.apply(this, arguments);
}
function _updateOneById() {
  _updateOneById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id, data) {
    var query, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          query = {
            _id: new _mongodb.ObjectId(id)
          };
          _context3.next = 4;
          return (0, _mongodb2.getDB)().collection('speech').updateOne(query, {
            $set: _objectSpread(_objectSpread({}, data), {}, {
              'updatedAt': Date.now
            })
          });
        case 4:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", {
            errors: _context3.t0.message
          });
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return _updateOneById.apply(this, arguments);
}
var SpeechModel = {
  insertOne: insertOne,
  findOneByIntent: findOneByIntent,
  updateOneById: updateOneById
};
exports.SpeechModel = SpeechModel;