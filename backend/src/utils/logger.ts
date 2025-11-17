import winston from 'winston';
import { isProd } from '../config/isProd';
import { getRequestContext } from './async-storage';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  http: 3,
  info: 4,
  debug: 5,
  trace: 6,
};

const logLevel = isProd ? 'info' : 'trace';

const { json, combine, timestamp, printf, colorize, align, errors } =
  winston.format;
const jsonFormat = json({ space: 2 });
const timestampFormat = timestamp();

const jsonLogFormat = combine(timestampFormat, jsonFormat);
const colorizedLogFormat = combine(
  colorize({ message: false }),
  timestampFormat,
  align(),
  printf(
    (info) =>
      `[${info.timestamp}] ${info.level}: ${info.message} : ${JSON.stringify(info, null, 2)}`
  )
);
const httpFilter = winston.format((info) => {
  // Only pass through if the level is 'http'
  if (info?.level === 'http') {
    return info;
  }
  return false; // Discard other log levels
});
const httpLogFormat = combine(httpFilter(), jsonLogFormat);

const colorizedLogConsoleTransport = new winston.transports.Console({
  format: colorizedLogFormat,
  level: logLevel,
});
const allLogFileTransport = new winston.transports.File({
  format: jsonLogFormat,
  filename: 'logs/all.log',
});
const errorLogFileTransport = new winston.transports.File({
  format: jsonLogFormat,
  level: 'error',
  filename: 'logs/error.log',
});

const httpLogConsoleTransport = new winston.transports.Console({
  format: httpLogFormat,
});

const prodTransports: winston.transport[] | undefined = [
  colorizedLogConsoleTransport,
];
const transports = [
  colorizedLogConsoleTransport,
  allLogFileTransport,
  errorLogFileTransport,
  httpLogConsoleTransport,
];

const logger = winston.createLogger({
  levels: logLevels,
  format: combine(errors({ stack: true })),
  defaultMeta: {
    app: 'ct-pcgis',
    environment: isProd ? 'prod' : 'dev',
  },
  transports: isProd ? prodTransports : transports,
});

const wrapLogMethod = (level: string) => {
  return (message: string, meta: Record<string, unknown> = {}) => {
    logger.log(level, message, {
      ...meta,
      requestContext: getRequestContext(), // ✅ Inject request ID dynamically
    });
  };
};

export default {
  fatal: wrapLogMethod('fatal'),
  error: wrapLogMethod('error'),
  warn: wrapLogMethod('warn'),
  http: wrapLogMethod('http'),
  info: wrapLogMethod('info'),
  debug: wrapLogMethod('debug'),
  trace: wrapLogMethod('trace'),
};
