"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speechRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _speech = require("../../controllers/speech.controller");
// Import from controllers

var router = _express["default"].Router();
router.route('/').get(_speech.SpeechController.getSpeechByText);
router.route('/').post(_speech.SpeechController.createSpeech);
var speechRoutes = router;
exports.speechRoutes = speechRoutes;