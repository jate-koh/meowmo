import { WinstonLogger } from '@/lib/logger';
import { ServerConfig } from '@/lib/types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';

export class Loader {
  private logger: WinstonLogger;
  private config: ServerConfig;

  private rest: REST = {} as REST;

  public constructor(
    logger: WinstonLogger,
    config?: ServerConfig,
    token?: string,
    serverId?: string,
  ) {
    this.logger = logger;
    this.config = config || { token: token || '', guildId: serverId || '', commands: [] };

    this.logger.info('Loader config loaded');
  }

  public async start(bot: Client) {
    this.logger.info('Loader starting');
    this.rest = new REST({ version: '9' }).setToken(this.config.token);

    if (!bot.user) return this.logger.error('Bot user not found');
    await this.rest.put(Routes.applicationGuildCommands(bot.user.id, this.config.guildId), {
      body: 'test',
    });
  }

  public load() {
    this.logger.info('Loader loading');
  }
}

export default Loader;
