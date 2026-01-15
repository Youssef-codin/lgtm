import app from './app';
import { logger } from './middleware/logger';

const port = process.env.PORT || 3000;

async function start() {
    app.listen(port, () => {
        logger.info(`App listening on port ${port}`);
    });
}

start().catch((err) => {
    logger.error('Failed to start:', err);
    process.exit(1);
});
