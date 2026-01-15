"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.logPrismaQuery = logPrismaQuery;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../prisma/src/generated/prisma/client");
const logger_1 = require("../middleware/logger");
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
    adapter,
});
exports.prisma = prisma;
function logPrismaQuery(event) {
    const { query, params, duration, target } = event;
    // Try to prettify params for clarity
    let prettyParams = params;
    try {
        prettyParams = JSON.stringify(JSON.parse(params), null, 2);
    }
    catch {
        // leave as-is
    }
    const message = [
        '',
        '┌─── Prisma Query ───────────────────────────────────────',
        `│ Target:   ${target}`,
        `│ Duration: ${duration.toFixed(2)} ms`,
        '│',
        '│ Query:',
        ...query
            .trim()
            .split('\n')
            .map((line) => `│   ${line}`),
        '│',
        `│ Params: ${prettyParams}`,
        '└────────────────────────────────────────────────────────',
        '',
    ].join('\n');
    logger_1.logger.info(message);
}
prisma.$on('query', (e) => {
    logPrismaQuery(e);
});
prisma.$on('error', (e) => {
    logger_1.logger.info(e);
});
prisma.$on('info', (e) => {
    logger_1.logger.info(e);
});
prisma.$on('warn', (e) => {
    logger_1.logger.info(e);
});
