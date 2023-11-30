"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudinaryService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _cloudinary = _interopRequireDefault(require("cloudinary"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _environment = require("../../config/environment");
var _utils = require("./utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } // Import from env
var cloudinaryV2 = _cloudinary["default"].v2;

// Configure cloudinary
cloudinaryV2.config({
  cloud_name: _environment.env.CLOUDINARY_NAME,
  api_key: _environment.env.CLOUDINARY_API_KEY,
  api_secret: _environment.env.CLOUDINARY_API_SECRET
});

/**
 * Use to upload a temp file in folder `uploads`. After upload processing is done, the temp file in `uploads` will be deleted.
 * Limit size of upload file is 5 mb.
 * @param file
 * @param options
 * @returns
 */
function uploadAsync(_x, _x2, _x3) {
  return _uploadAsync.apply(this, arguments);
}
/**
 * Use to upload temp files in folder `uploads`. After upload processing is done, the temp file in `uploads` will be deleted.
 * Limit size of upload files is 5 mb.
 * @param fileInfors
 * @param options
 * @returns
 */
function _uploadAsync() {
  _uploadAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file, options, fsCB) {
    var uploadResponse;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // let filePath = path.resolve(environments.UPLOAD_PATHS.ROOT, file)
          uploadResponse = cloudinaryV2.uploader.upload(file, options, function (err, result) {
            if (!err) {
              var cb = fsCB ? fsCB : function (err) {
                if (err) throw err;
              };
              // fs.unlink(file, cb)
            }
          });
          return _context.abrupt("return", uploadResponse);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _uploadAsync.apply(this, arguments);
}
function uploadMultipleAsync(_x4, _x5) {
  return _uploadMultipleAsync.apply(this, arguments);
}
/**
 * Use to delete a resource in cloud by its `url`.
 * @param url
 */
function _uploadMultipleAsync() {
  _uploadMultipleAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileInfors, options) {
    var promises, _iterator, _step, fileInfor, name, opts;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          promises = [];
          _iterator = _createForOfIteratorHelper(fileInfors);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              fileInfor = _step.value;
              name = void 0;
              opts = void 0;
              if (typeof fileInfor === 'string') {
                name = fileInfor;
                opts = options;
              } else {
                name = fileInfor.name;
                opts = Object.assign({}, options, fileInfor.options);
              }
              promises.push(uploadAsync(name, opts));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return _context2.abrupt("return", Promise.all(promises));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _uploadMultipleAsync.apply(this, arguments);
}
function deleteAsync(_x6) {
  return _deleteAsync.apply(this, arguments);
}
/**
 * Use to delete resources from cloud by their `url`.
 * @param urls
 * @returns
 */
function _deleteAsync() {
  _deleteAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(url) {
    var info;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          info = _utils.CloudinaryUtils.getResourceInformation(url);
          if (info) {
            _context3.next = 3;
            break;
          }
          throw new Error('Invalid url of resouce.');
        case 3:
          return _context3.abrupt("return", cloudinaryV2.api.delete_resources([info.publicId]));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _deleteAsync.apply(this, arguments);
}
function deleteMultipleAsync(_x7) {
  return _deleteMultipleAsync.apply(this, arguments);
}
function _deleteMultipleAsync() {
  _deleteMultipleAsync = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(urls) {
    var promises, _iterator2, _step2, url;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          promises = [];
          _iterator2 = _createForOfIteratorHelper(urls);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              url = _step2.value;
              promises.push(deleteAsync(url));
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          return _context4.abrupt("return", Promise.all(promises));
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _deleteMultipleAsync.apply(this, arguments);
}
var CloudinaryService = {
  uploadAsync: uploadAsync,
  deleteAsync: deleteAsync,
  uploadMultipleAsync: uploadMultipleAsync,
  deleteMultipleAsync: deleteMultipleAsync
};
exports.CloudinaryService = CloudinaryService;