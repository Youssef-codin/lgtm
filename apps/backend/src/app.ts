import express from 'express';
import helmet from 'helmet';
import { authenticate } from './middleware/authenticate';
import errorHandler, { ERROR_CODE } from './middleware/errorHandler';
import log from './middleware/logger';
import { fail, respond } from './util/ApiResponse';

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(log);

app.use(authenticate);

//-- catch all 404
app.use((req, res) => {
    return respond(res, 404, fail('Route not found', ERROR_CODE.NOT_FOUND));
});
//-- error handler --
app.use(errorHandler);

export default app;
