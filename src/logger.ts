import { createLogger, format, transports, type Logger } from 'winston';
import { settings } from './settings.ts';

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger: Logger = createLogger({
  level: settings.logLevel,
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), logFormat),
    }),
    new transports.File({
      filename: 'app.log',
      format: logFormat,
    }),
  ],
});
