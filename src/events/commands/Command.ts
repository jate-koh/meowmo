import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { CommandInteraction } from 'discord.js';

export type CommandData =
  | Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>
  | SlashCommandSubcommandsOnlyBuilder
  | RESTPostAPIChatInputApplicationCommandsJSONBody;

export type Command = {
  data: CommandData;

  run(command: CommandInteraction): Promise<void>;

  getCommandData(): CommandData;
};

export default Command;
