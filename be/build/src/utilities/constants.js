"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHITELIST_DOMAINS = exports.WEBSITE_DOMAIN = exports.HttpStatusCode = void 0;
var _environment = require("../config/environment");
var HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  EXPIRED: 410 //GONE
};
exports.HttpStatusCode = HttpStatusCode;
var WHITELIST_DOMAINS = ['http://localhost:3000', 'http://localhost:3001', 'https://dong-nai-travel-admin.vercel.app', 'http://localhost:5173'];
exports.WHITELIST_DOMAINS = WHITELIST_DOMAINS;
var websiteDomain = 'http://localhost:3000';
if (_environment.env.BUILD_MODE === 'production') {
  websiteDomain = 'https://dong-nai-travel-admin.vercel.app';
}
var WEBSITE_DOMAIN = websiteDomain;
exports.WEBSITE_DOMAIN = WEBSITE_DOMAIN;