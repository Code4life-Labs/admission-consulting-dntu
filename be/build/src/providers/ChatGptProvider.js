"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatGptProvider = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _openai = _interopRequireDefault(require("openai"));
var _environment = require("../config/environment");
var openai = new _openai["default"]({
  apiKey: _environment.env.CHATGPT_API_KEY
});
var textGeneration = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryText) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('🚀 ~ file: ChatGptProvider.js:5 ~ textGeneration ~ queryText:', queryText);
          _context.prev = 1;
          _context.next = 4;
          return openai.completions.create({
            model: 'text-davinci-003',
            prompt: "Human: textInitial=\"Hello\", textTranslated=\"Xin Ch\xE0o\" \nChatbot: T\u1EEB Ti\u1EBFng Anh \"Hello\" c\xF3 ngh\u0129a l\xE0 \"Xin ch\xE0o\" trong Ti\u1EBFng Vi\u1EC7t \nHuman: ".concat(queryText, " \nChatbot: "),
            temperature: 0.1,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
          });
        case 4:
          response = _context.sent;
          console.log('🚀 ~ file: ChatGptProvider.js:49 ~ textGeneration ~ response:', response);
          return _context.abrupt("return", {
            isSuccess: true,
            response: "".concat(response.choices[0].text).trimStart()
          });
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.log('🚀 ~ file: ChatGptProvider.js:45 ~ textGeneration ~ error:', _context.t0);
          return _context.abrupt("return", {
            isSuccess: false,
            response: 'Có lỗi trong quá trình gọi đến chatgpt'
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 9]]);
  }));
  return function textGeneration(_x) {
    return _ref.apply(this, arguments);
  };
}();
var translateText = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(queryText) {
    var response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return openai.completions.create({
            model: 'text-davinci-003',
            prompt: "Human: text=\"Hello\",languageConvert=\"vietnamese\" \nChatbot: \"Xin ch\xE0o\" \nHuman: text=\"Nh\u1EEFng con ch\xF3\",languageConvert=\"english\" \nChatbot: \"Dogs\" trong Ti\u1EBFng Vi\u1EC7t \nHuman: ".concat(queryText, " \nChatbot: "),
            temperature: 0.1,
            max_tokens: 3500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
          });
        case 3:
          response = _context2.sent;
          console.log('🚀 ~ file: ChatGptProvider.js:49 ~ textGeneration ~ response:', response);
          return _context2.abrupt("return", {
            isSuccess: true,
            response: "".concat(response.choices[0].text).trimStart()
          });
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log('🚀 ~ file: ChatGptProvider.js:45 ~ textGeneration ~ error:', _context2.t0);
          return _context2.abrupt("return", {
            isSuccess: false,
            response: 'Xin lỗi đã có vấn trong quá trình gọi đến server!'
          });
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function translateText(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var ChatGptProvider = {
  textGeneration: textGeneration,
  translateText: translateText
};
exports.ChatGptProvider = ChatGptProvider;