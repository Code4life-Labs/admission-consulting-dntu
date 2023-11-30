"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeechSchema = void 0;
exports.validateAsync = validateAsync;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _lib = _interopRequireDefault(require("joi/lib"));
var self = _lib["default"].object({
  intent: _lib["default"].string().required(),
  audio: _lib["default"].string()["default"](''),
  text: _lib["default"].string().required(),
  createdAt: _lib["default"].date().timestamp('javascript')["default"](Date.now),
  updatedAt: _lib["default"].date().timestamp()["default"](null)
});
function validateAsync(_x) {
  return _validateAsync.apply(this, arguments);
}
function _validateAsync() {
  _validateAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return self.validateAsync(data);
        case 2:
          return _context.abrupt("return", _context.sent);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _validateAsync.apply(this, arguments);
}
var SpeechSchema = {
  self: self,
  validateAsync: validateAsync
};
exports.SpeechSchema = SpeechSchema;