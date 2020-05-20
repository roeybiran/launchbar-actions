"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p_cancelable_1 = require("p-cancelable");
exports.CancelError = p_cancelable_1.CancelError;
const core_1 = require("../core");
exports.RequestError = 
// Errors to be exported
core_1.RequestError;
exports.MaxRedirectsError = core_1.MaxRedirectsError;
exports.CacheError = core_1.CacheError;
exports.UploadError = core_1.UploadError;
exports.TimeoutError = core_1.TimeoutError;
exports.HTTPError = core_1.HTTPError;
exports.ReadError = core_1.ReadError;
exports.UnsupportedProtocolError = core_1.UnsupportedProtocolError;
class ParseError extends core_1.RequestError {
    constructor(error, response) {
        const { options } = response.request;
        super(`${error.message} in "${options.url.toString()}"`, error, response.request);
        this.name = 'ParseError';
        Object.defineProperty(this, 'response', {
            enumerable: false,
            value: response
        });
    }
}
exports.ParseError = ParseError;
