import expressPino from 'express-pino-logger';
import { logger } from 'loaders/logger';

const expressLogger = expressPino({ logger });

export default expressLogger;