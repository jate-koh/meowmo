import path from 'path';
import * as winston from 'winston';

export const LogLevelsMap = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  silly: 4,
};

export type LogLevel = keyof typeof LogLevelsMap;

const formatTime = (timestamp: string) => {
  return timestamp.slice(0, 19).replace('T', ' ');
};

const formatMessage = (level: number, colorize: boolean = true) => {
  switch (level) {
    case LogLevelsMap.error:
      return winston.format.combine(
        colorize ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, error, module, ...args } = info;
          const caller = `${module ? `[${(module as string).toUpperCase()}]` : ''}`;
          const content = `${message}:
            ${error instanceof Error ? error.stack : error}
            ${Object.keys(args).length ? JSON.stringify(args, null) : ''}`;

          return `${caller} ${formatTime(timestamp)} ${level} ${content}`;
        }),
      );
    case LogLevelsMap.warn || LogLevelsMap.info || LogLevelsMap.debug || LogLevelsMap.silly:
      return winston.format.combine(
        colorize ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, module, ...args } = info;
          const caller = `${module ? `[${(module as string).toUpperCase()}]` : ''}`;
          const content = `${message} ${Object.keys(args).length ? JSON.stringify(args, null) : ''}`;

          return `${caller} ${formatTime(timestamp)} ${level} ${content}`;
        }),
      );
    default:
      return winston.format.combine(
        colorize ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, module, ...args } = info;
          const caller = `${module ? `[${(module as string).toUpperCase()}]` : ''}`;
          const content = `${message} ${Object.keys(args).length ? JSON.stringify(args, null) : ''}`;

          return `${caller} ${formatTime(timestamp)} ${level} ${content}`;
        }),
      );
  }
};

export const LogPath = path.join(__dirname, '../log');

export const Logger = winston.createLogger({
  level: 'silly',
  levels: LogLevelsMap,
  transports: [
    new winston.transports.Console({}),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      dirname: LogPath,
      format: winston.format.combine(
        winston.format.align(),
        formatMessage(LogLevelsMap.error, false),
      ),
    }),
    new winston.transports.File({
      level: 'info',
      filename: 'combined.log',
      dirname: LogPath,
      format: winston.format.combine(
        winston.format.align(),
        formatMessage(LogLevelsMap.info, false),
      ),
    }),
    new winston.transports.File({
      level: 'warn',
      filename: 'combined.log',
      dirname: LogPath,
      format: winston.format.combine(
        winston.format.align(),
        formatMessage(LogLevelsMap.warn, false),
      ),
    }),
  ],
});

export const setLogFormat = (level: LogLevel) => {
  Logger.transports.forEach((transport) => {
    if (transport instanceof winston.transports.Console) {
      transport.format = winston.format.combine(
        winston.format.align(),
        formatMessage(LogLevelsMap[level]),
      );
    }
  });
};

export type WinstonLogger = typeof Logger;

export default Logger as WinstonLogger;
