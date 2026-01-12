"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = __importDefault(require("zod"));
const errorHandler_1 = require("./errorHandler");
const ApiResponse_1 = require("../util/ApiResponse");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        params: req.params,
        body: req.body,
        query: req.query,
    });
    if (!result.success) {
        return (0, ApiResponse_1.respond)(res, 400, (0, ApiResponse_1.fail)(zod_1.default.prettifyError(result.error), errorHandler_1.ERROR_CODE.VALIDATION_FAILED));
    }
    return next();
};
exports.validate = validate;
