"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILE_URL_RULE = void 0;
var FILE_URL_RULE = /((http|https):\/\/[\w\d_\-.]+\.[\w\d]{2,}([:\d]+)?(\/[\w\d\-._?,'/\\+&%$#=~]*)?)/;
exports.FILE_URL_RULE = FILE_URL_RULE;