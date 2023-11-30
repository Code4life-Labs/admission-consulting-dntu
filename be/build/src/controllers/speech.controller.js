"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeechController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _speech = require("../models/speech");
var _fptbot = require("../services/fptbot.service");
var _cloudinary = require("../services/cloudinary");
var _constants = require("../utilities/constants");
// Import from models
// Import from services
// Import from utils
/**
 * Use this function to insert a speech to database.
 * @param {*} req
 * @param {*} res
 */
function createSpeech(_x, _x2) {
  return _createSpeech.apply(this, arguments);
}
/**
 * Use this function to get speech from query string (text).
 * @param {*} req
 * @param {*} res
 * @returns
 */
function _createSpeech() {
  _createSpeech = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, search, text, response, responseAsJSON, predict, insertResult;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, search = _req$body.search, text = _req$body.text;
          _context.next = 4;
          return _fptbot.FPTBotServices.getPredict(search);
        case 4:
          response = _context.sent;
          _context.next = 7;
          return response.json();
        case 7:
          responseAsJSON = _context.sent;
          predict = responseAsJSON.data.intents[0]; // Insert to database
          _context.next = 11;
          return _speech.SpeechModel.insertOne({
            intent: predict.label,
            text: text
          });
        case 11:
          insertResult = _context.sent;
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.OK).json(insertResult));
        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context.t0.message
          }));
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 15]]);
  }));
  return _createSpeech.apply(this, arguments);
}
function getSpeechByText(_x3, _x4) {
  return _getSpeechByText.apply(this, arguments);
}
function _getSpeechByText() {
  _getSpeechByText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var text, response, responseAsJSON, predict, speechDoc, audio, fptbotResult, fptbotResultData, cloudinaryResult, url;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          text = req.query.text;
          _context2.next = 4;
          return _fptbot.FPTBotServices.getPredict(text);
        case 4:
          response = _context2.sent;
          _context2.next = 7;
          return response.json();
        case 7:
          responseAsJSON = _context2.sent;
          predict = responseAsJSON.data.intents[0]; // 1. Get speech doc from `predict.label`.
          _context2.next = 11;
          return _speech.SpeechModel.findOneByIntent(predict.label);
        case 11:
          speechDoc = _context2.sent;
          audio = ''; // If not found, response
          if (speechDoc) {
            _context2.next = 15;
            break;
          }
          return _context2.abrupt("return", res.status(_constants.HttpStatusCode.OK).json({
            message: "Audio for \"".concat(text, "\" not found")
          }));
        case 15:
          if (audio = speechDoc.audio) {
            _context2.next = 29;
            break;
          }
          _context2.next = 18;
          return _fptbot.FPTBotServices.getSpeech(speechDoc.text);
        case 18:
          fptbotResult = _context2.sent;
          _context2.next = 21;
          return fptbotResult.json();
        case 21:
          fptbotResultData = _context2.sent;
          _context2.next = 24;
          return _cloudinary.CloudinaryService.uploadAsync(fptbotResultData.async, {
            folder: 'audios',
            resource_type: 'auto'
          });
        case 24:
          cloudinaryResult = _context2.sent;
          url = cloudinaryResult.url;
          _context2.next = 28;
          return _speech.SpeechModel.updateOneById(speechDoc._id, {
            audio: url
          });
        case 28:
          return _context2.abrupt("return", res.status(_constants.HttpStatusCode.OK).json({
            audio: cloudinaryResult.url
          }));
        case 29:
          return _context2.abrupt("return", res.status(_constants.HttpStatusCode.OK).json({
            audio: audio
          }));
        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
            errors: _context2.t0.message
          }));
        case 35:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 32]]);
  }));
  return _getSpeechByText.apply(this, arguments);
}
var SpeechController = {
  createSpeech: createSpeech,
  getSpeechByText: getSpeechByText
};
exports.SpeechController = SpeechController;