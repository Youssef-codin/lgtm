"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inParams = inParams;
exports.inBody = inBody;
exports.inBodyAndParams = inBodyAndParams;
exports.inQuery = inQuery;
const zod_1 = __importDefault(require("zod"));
function inParams(object) {
    return zod_1.default.object({
        params: object,
    });
}
function inBody(object) {
    return zod_1.default.object({
        body: object,
    });
}
function inBodyAndParams(params, object) {
    return zod_1.default.object({
        params: params,
        body: object,
    });
}
function inQuery(query) {
    return zod_1.default.object({
        query: query,
    });
}
