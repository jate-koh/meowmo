import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';

export type MeowmoConfig = {
  token: string;
  guildId: string;
};

export type ServerConfig = {
  token: string;
  guildId: string;
  commands: RESTPostAPIApplicationCommandsJSONBody[];
};
