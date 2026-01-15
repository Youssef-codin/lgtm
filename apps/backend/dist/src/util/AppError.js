"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    status;
    code;
    constructor(status = 500, message, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.AppError = AppError;
