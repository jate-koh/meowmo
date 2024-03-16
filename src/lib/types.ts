import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';

export type MeowmoConfig = {
  token: string;
  guildId: string;
};

export type MeowmoOptions = {
  keepLogs?: boolean;
  logsPath?: string;
};

export enum MeowmoLogLevels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
  silly = 'silly',
}

export type LoaderConfig = {
  token: string;
  guildId: string;
  commands: RESTPostAPIApplicationCommandsJSONBody[];
};
