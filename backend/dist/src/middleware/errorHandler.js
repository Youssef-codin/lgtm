"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODE = void 0;
exports.getErrorMessage = getErrorMessage;
exports.default = errorHandler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../util/AppError");
const ApiResponse_1 = require("../util/ApiResponse");
const logger_1 = require("./logger");
var ERROR_CODE;
(function (ERROR_CODE) {
    ERROR_CODE["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ERROR_CODE["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    ERROR_CODE["NOT_FOUND"] = "NOT_FOUND";
    ERROR_CODE["UNAUTHENTICATED"] = "UNAUTHENTICATED";
    ERROR_CODE["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    ERROR_CODE["UNAUTHORIZED"] = "UNAUTHORIZED";
})(ERROR_CODE || (exports.ERROR_CODE = ERROR_CODE = {}));
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An error occured. Please view logs for more details.';
}
function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        next(error);
        return;
    }
    let status = 500;
    let message = getErrorMessage(error);
    let code = ERROR_CODE.UNKNOWN_ERROR;
    if (error instanceof AppError_1.AppError) {
        status = error.status;
        code = error.code;
    }
    else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
        status = 401;
        message = 'Token expired';
        code = ERROR_CODE.UNAUTHENTICATED;
    }
    else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        status = 401;
        message = 'Invalid token';
        code = ERROR_CODE.UNAUTHENTICATED;
    }
    else if (error instanceof SyntaxError &&
        error.status === 400 &&
        'body' in error) {
        status = 400;
        message = 'Invalid JSON payload';
        code = ERROR_CODE.VALIDATION_FAILED;
    }
    else {
        logger_1.logger.error({ err: error, path: req.path }, 'Unhandled Error');
    }
    return (0, ApiResponse_1.respond)(res, status, (0, ApiResponse_1.fail)(message, code));
}
