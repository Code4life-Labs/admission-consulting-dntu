"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatbotService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _dialogflow = _interopRequireDefault(require("@google-cloud/dialogflow"));
var _dfConfig = require("../config/dfConfig");
var _ChatGptProvider = require("../providers/ChatGptProvider");
/* eslint-disable no-unreachable */

var getTextConsulting = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var projectId, sessionId, credentials, sessionClient, sessionPath, req, res, action, queryText, responseText;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // connect to dialogflow api
          projectId = _dfConfig.dfConfig.project_id;
          sessionId = data.currentUserId;
          credentials = {
            client_email: _dfConfig.dfConfig.client_email,
            private_key: _dfConfig.dfConfig.private_key
          }; // Create a new session
          sessionClient = new _dialogflow["default"].SessionsClient({
            credentials: credentials
          });
          sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
          req = {
            session: sessionPath,
            queryInput: {
              text: {
                text: data.question,
                languageCode: data.languageCode
              }
            }
          };
          _context.next = 9;
          return sessionClient.detectIntent(req);
        case 9:
          res = _context.sent;
          // return res
          action = res[0].queryResult.action;
          console.log('🚀 ~ file: chatbot.service.js:39 ~ getTextConsulting ~ action:', action);
          queryText = res[0].queryResult.queryText;
          responseText = res[0].queryResult.fulfillmentMessages[0].text.text[0];
          console.log('🚀 ~ file: chatbot.service.js:46 ~ getTextConsulting ~ responseText:', responseText);
          if (!(action === 'input.unknown')) {
            _context.next = 19;
            break;
          }
          return _context.abrupt("return", {
            response: responseText,
            action: action
          });
        case 19:
          return _context.abrupt("return", {
            response: responseText,
            action: action
          });
        case 20:
          _context.next = 26;
          break;
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          console.log('🚀 ~ file: chatbot.service.js:67 ~ getTextConsulting ~ error:', _context.t0);
          throw new Error(_context.t0);
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 22]]);
  }));
  return function getTextConsulting(_x) {
    return _ref.apply(this, arguments);
  };
}();
var generateTextGPT = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
    var queryText, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          queryText = "textInitial=\"".concat(data.textInitial, "\", textTranslated=\"").concat(data.textTranslated, "\"");
          _context2.next = 4;
          return _ChatGptProvider.ChatGptProvider.textGeneration(queryText);
        case 4:
          result = _context2.sent;
          return _context2.abrupt("return", result);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return function generateTextGPT(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var translateTextGPT = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
    var queryText, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          queryText = "text=\"".concat(data.text, "\", languageConvert=\"").concat(data.languageConvert, "\"");
          _context3.next = 4;
          return _ChatGptProvider.ChatGptProvider.translateText(queryText);
        case 4:
          result = _context3.sent;
          return _context3.abrupt("return", result);
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          throw new Error(_context3.t0);
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function translateTextGPT(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var ChatbotService = {
  getTextConsulting: getTextConsulting,
  generateTextGPT: generateTextGPT,
  translateTextGPT: translateTextGPT
};
exports.ChatbotService = ChatbotService;