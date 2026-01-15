"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const AppError_1 = require("../util/AppError");
const errorHandler_1 = require("./errorHandler");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new AppError_1.AppError(401, 'Invalid authorization header', errorHandler_1.ERROR_CODE.UNAUTHENTICATED);
    const token = req.headers.authorization.split(' ')[1];
    //TODO: IMPLEMENT AUTH LOGIC
    next();
}
