import Logger, { LogLevel, WinstonLogger, setLogFormat } from '@/lib/logger';

export enum MeowmoLogLevels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
  silly = 'silly',
}

export class MeowmoLogger {
  private static instance: MeowmoLogger;
  private logger: WinstonLogger = Logger;

  private constructor() {}

  public static getInstance() {
    if (!MeowmoLogger.instance) {
      MeowmoLogger.instance = new MeowmoLogger();
    }
    return MeowmoLogger.instance;
  }

  public info(message: string, ...args: unknown[]) {
    this.send(MeowmoLogLevels.info, message, args);
  }

  public debug(message: string, ...args: unknown[]) {
    this.send(MeowmoLogLevels.debug, message, args);
  }

  public error(message: string, error: Error, ...args: unknown[]) {
    this.send(MeowmoLogLevels.error, message, error, args);
  }

  public warn(message: string, ...args: unknown[]) {
    this.send(MeowmoLogLevels.warn, message, args);
  }

  public silly(message: string, ...args: unknown[]) {
    this.send(MeowmoLogLevels.silly, message, args);
  }

  public send(level: LogLevel, message: string, ...args: unknown[] | []) {
    setLogFormat(level);
    this.logger.log(
      level,
      message,
      args[0] instanceof Error ? { error: args[0] } : undefined,
      args[0] instanceof Error ? args.slice(1) : args,
    );
  }

  public child(options: { module: string }) {
    return this.logger.child(options);
  }
}

export default MeowmoLogger;
