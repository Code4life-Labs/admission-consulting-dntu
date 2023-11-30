"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chatbotRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _environment = require("../../config/environment");
var _chatbot = require("../../controllers/chatbot.controller");
var _fptbot = require("../../controllers/fptbot.controller");
var _chatbot2 = require("../../validations/chatbot.validation");
var _constants = require("../../utilities/constants");
// Import from env

// Import from controllers

// Import from validations

// Import from utils

var router = _express["default"].Router();
router.route('/consult').post(_chatbot2.ChatbotValidation.getTextConsulting, _chatbot.ChatbotController.getTextConsulting);

// Được sử dụng để cho dự án cô Thi
router.route('/generate-text-gpt').post(_chatbot2.ChatbotValidation.generateTextGPT, _chatbot.ChatbotController.generateTextGPT);
var chatbotRoutes = router;
exports.chatbotRoutes = chatbotRoutes;