"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHARED_CONSTANT = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
});
exports.SHARED_CONSTANT = "Hello from shared package";
