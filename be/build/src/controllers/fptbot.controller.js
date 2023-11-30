"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FPTController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _fptbot = require("../services/fptbot.service");
var _constants = require("../utilities/constants");
// Import from services
// Import from utils
/**
 * Use this function to get answer from bot.
 * @param {*} res
 * @param {*} req
 */
function getAnswer(_x, _x2) {
  return _getAnswer.apply(this, arguments);
}
function _getAnswer() {
  _getAnswer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, content, _req$body$type, type, response, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, content = _req$body.content, _req$body$type = _req$body.type, type = _req$body$type === void 0 ? 'text' : _req$body$type;
          _context.next = 4;
          return _fptbot.FPTBotServices.getAnswer(content, type);
        case 4:
          response = _context.sent;
          _context.next = 7;
          return response.json();
        case 7:
          result = _context.sent;
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.OK).json(result));
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context.t0.message
          }));
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return _getAnswer.apply(this, arguments);
}
var FPTController = {
  getAnswer: getAnswer
};
exports.FPTController = FPTController;