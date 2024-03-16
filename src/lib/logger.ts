import path from 'path';
import * as winston from 'winston';

const LogLevelsMap = {
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

const LogPath = path.join(__dirname, '../logs');

export const Logger = winston.createLogger({
  level: 'silly',
  levels: LogLevelsMap,
  transports: [new winston.transports.Console({})],
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

const DefaultFileTransportFormat: { [key in LogLevel]: winston.Logform.Format } = {
  info: winston.format.combine(winston.format.align(), formatMessage(LogLevelsMap.info, false)),
  warn: winston.format.combine(winston.format.align(), formatMessage(LogLevelsMap.warn, false)),
  error: winston.format.combine(winston.format.align(), formatMessage(LogLevelsMap.error, false)),
  debug: winston.format.combine(winston.format.align(), formatMessage(LogLevelsMap.debug, false)),
  silly: winston.format.combine(winston.format.align(), formatMessage(LogLevelsMap.silly, false)),
};

export const addLogFileTransport = (
  level: LogLevel,
  filename: string,
  dirname: string = LogPath,
  format: winston.Logform.Format = DefaultFileTransportFormat[level],
) => {
  Logger.add(
    new winston.transports.File({
      level: level,
      filename: filename,
      dirname: dirname,
      format: format,
    }),
  );
};

export const removeLogFileTransport = (filename?: string) => {
  if (filename) {
    Logger.transports = Logger.transports.filter((transport) => {
      if (transport instanceof winston.transports.File) {
        return transport.filename !== filename;
      }
      return true;
    });
  } else {
    Logger.transports.forEach((transport) => {
      if (transport instanceof winston.transports.File) {
        transport.destroy();
      }
    });
  }
};

export type WinstonLogger = typeof Logger;

export default Logger as WinstonLogger;
