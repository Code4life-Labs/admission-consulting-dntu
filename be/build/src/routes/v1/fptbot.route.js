"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fptbotRoutes = void 0;
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

// FPT BOT
router.route('/answer-text').get(function (req, res) {
  try {
    if (req.query.token !== _environment.env.FPT_WEBHOOK_TOKEN) {
      return res.status(_constants.HttpStatusCode.UNAUTHORIZED).json({
        errors: 'Invalid token'
      });
    }
    return res.status(_constants.HttpStatusCode.OK).send(_environment.env.FPT_WEBHOOK_TOKEN);
  } catch (error) {
    return res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    });
  }
});
router.route('/answer-text').post(function (req, res, next) {
  try {
    if (req.query.token !== _environment.env.FPT_WEBHOOK_TOKEN) {
      return res.status(_constants.HttpStatusCode.UNAUTHORIZED).json({
        errors: 'Invalid token'
      });
    }
    return next();
  } catch (error) {
    return res.status(_constants.HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    });
  }
}, _fptbot.FPTController.getAnswer);
var fptbotRoutes = router;
exports.fptbotRoutes = fptbotRoutes;