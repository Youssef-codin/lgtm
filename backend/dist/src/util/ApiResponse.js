"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
exports.respond = respond;
const ok = (data) => ({
    success: true,
    data,
});
exports.ok = ok;
const fail = (message, code) => ({
    success: false,
    error: { message, code },
});
exports.fail = fail;
function respond(res, status, response) {
    res.status(status).json(response);
}
