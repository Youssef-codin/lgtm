"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./middleware/logger");
const port = process.env.PORT || 3000;
async function start() {
    app_1.default.listen(port, () => {
        logger_1.logger.info(`App listening on port ${port}`);
    });
}
start().catch((err) => {
    logger_1.logger.error('Failed to start:', err);
    process.exit(1);
});
