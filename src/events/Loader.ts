import Command from '@/events/commands/Command';
import { WinstonLogger } from '@/lib/logger';
import { LoaderConfig } from '@/lib/types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, CommandInteraction } from 'discord.js';

export class Loader {
  private logger: WinstonLogger;
  private config: LoaderConfig;
  private rest: REST = {} as REST;

  private commandCache: Map<string, Command> = new Map<string, Command>();

  public constructor(logger: WinstonLogger, api: REST, serverId: string) {
    this.logger = logger;
    this.rest = api;
    this.config = {
      guildId: serverId,
      commands: [],
    };

    this.logger.info('Loader config loaded');
  }

  public async clear(bot: Client): Promise<void | Error> {
    this.logger.info('Clearing application commands');
    try {
      if (this.commandCache.size > 0) this.commandCache.clear();

      const { application, user } = bot;
      if (!user || !application) throw new Error('Application or bot user not found');

      await this.rest.put(Routes.applicationCommands(application.id), {
        body: [],
      });
    } catch (error) {
      this.logger.error('Error clearing commands', error as Error);
      Promise.reject(error);
    }
  }

  public async register(bot: Client, commands: Command[]): Promise<void | Error> {
    this.logger.info('Registering application commands');
    try {
      const { application, user } = bot;
      if (!user || !application) throw new Error('Application or bot user not found');

      this.logger.info('Checking cache for previous commands');
      const prevCommands = await application?.commands.fetch();
      if (prevCommands?.size > 0 || this.commandCache.size > 0) {
        await this.clear(bot).then(() => {
          this.logger.info('Previous commands cleared');
        });
      } else {
        this.logger.info('No previous commands found');
      }

      const commandData = commands.map((command) => command.getCommandData());

      commandData.forEach((command) => {
        this.commandCache.set(command.name, commands[commandData.indexOf(command)]);
      });

      await this.rest
        .put(Routes.applicationCommands(application.id), {
          body: commandData,
        })
        .then(() => {
          this.logger.info('Application commands registered');
        });
    } catch (error) {
      this.logger.error('Error registering commands', error as Error);
      Promise.reject(error);
    }
  }

  public async load(interaction: CommandInteraction): Promise<void | Error> {
    this.logger.info(`Checking cache for ${interaction.commandName}`);
    const command = this.commandCache.get(interaction.commandName);
    if (!command) {
      const error = new Error('Command not found');
      this.logger.error(`Command ${interaction.commandName} not found in cache`, error);
      return Promise.reject(error);
    }

    try {
      await command.run(interaction);
    } catch (error) {
      this.logger.error(
        `Error running the command ${command.getCommandData().name}`,
        error as Error,
      );
      Promise.reject(error);
    }
  }
}

export default Loader;
