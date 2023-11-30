"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FPTBotServices = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _environment = require("../config/environment");
// Import from config

var _botBaseURL_ = 'https://bot.fpt.ai';
var _v3APIBaseURL_ = 'https://v3-api.fpt.ai';
var _apiBaseURL_ = 'https://api.fpt.ai';
var _channel_ = 'api';
var _api_ = {
  chatbot: '/api/get_answer',
  predict: '/api/v3/predict',
  tts: "/hmi/tts/v5?api_key=".concat(_environment.env.FPT_TTS_API_KEY, "&voice=linhsan")
};
var _type_ = 'text';
var BOT_URL = _botBaseURL_ + _api_.chatbot;
var PREDICT_URL = _v3APIBaseURL_ + _api_.predict;
var TTS_URL = _apiBaseURL_ + _api_.tts;

/**
 * __Local function__
 *
 * Use this function to create a request body for bot's answer request.
 * @param {string} content
 * @param {string} type
 * @returns
 */
function getRequestBody(content) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _type_;
  return {
    'channel': _channel_,
    'app_code': _environment.env.FPT_BOT_CODE,
    'sender_id': _environment.env.FPT_SENDER_ID,
    'type': _type_,
    'message': {
      'content': content,
      'type': type
    }
  };
}

/**
 * Use this function to get FPT Bot's answer from FPT BOT.
 * @param {string} content
 * @param {string} type
 */
function getAnswer(_x) {
  return _getAnswer.apply(this, arguments);
}
/**
 * Use this function to get predicts from NPL of FPT.
 * @param {string} text
 * @returns
 */
function _getAnswer() {
  _getAnswer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(content) {
    var type,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          type = _args.length > 1 && _args[1] !== undefined ? _args[1] : _type_;
          return _context.abrupt("return", fetch(BOT_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + _environment.env.FPT_API_KEY
            },
            method: 'post',
            body: JSON.stringify(getRequestBody(content, type))
          }));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getAnswer.apply(this, arguments);
}
function getPredict(_x2) {
  return _getPredict.apply(this, arguments);
}
/**
 * Use this function to get text from string.
 * @param {string} text
 */
function _getPredict() {
  _getPredict = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(text) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", fetch(PREDICT_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + _environment.env.FPT_API_KEY
            },
            method: 'post',
            body: JSON.stringify({
              content: text
            })
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getPredict.apply(this, arguments);
}
function getSpeech(_x3) {
  return _getSpeech.apply(this, arguments);
}
function _getSpeech() {
  _getSpeech = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(text) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", fetch(TTS_URL, {
            method: 'post',
            body: text
          }));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getSpeech.apply(this, arguments);
}
var FPTBotServices = {
  getAnswer: getAnswer,
  getPredict: getPredict,
  getSpeech: getSpeech
};
exports.FPTBotServices = FPTBotServices;