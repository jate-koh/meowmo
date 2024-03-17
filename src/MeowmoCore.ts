import CoreBot from '@/CoreBot';
import MeowmoLogger from '@/Logger';
import Loader from '@/events/Loader';
import { DefaultOptions, IntentOptions } from '@/lib/constants';
import { MeowmoConfig, MeowmoOptions } from '@/lib/types';
import { Client, Interaction, REST } from 'discord.js';

export abstract class MeowmoCore implements CoreBot {
  protected config: MeowmoConfig;
  protected options: MeowmoOptions;
  protected logger: MeowmoLogger;

  protected api: REST = {} as REST;
  protected loader: Loader = {} as Loader;
  protected bot: Client = {} as Client;

  public constructor(
    token: string,
    guildId: string,
    options?:
      | {
          keepLogs?: boolean;
          logsPath?: string;
        }
      | MeowmoOptions,
  ) {
    this.logger = MeowmoLogger.getInstance();
    this.config = {
      token,
      guildId,
    };

    if (options) {
      this.options = options as MeowmoOptions;
    } else {
      this.options = DefaultOptions;
    }

    this.logger.setup(this.options.keepLogs, this.options.logsPath);
    if (!this.options.keepLogs) {
      this.logger.warn('Logs are not being kept as files!');
    }
    this.logger.info('Meowmo logger setup completed');
    this.logger.info('Meowmo initial setup completed');
  }

  public meow() {
    this.logger.silly('Meow! Mouuu!');
  }

  public async start(): Promise<void | Error> {
    this.logger.info('Meowmo starting');

    this.api = new REST({ version: '9' }).setToken(this.config.token);
    this.logger.info('Meowmo REST API setup completed');

    this.bot = new Client({ intents: IntentOptions });

    this.bot.once('ready', () => {
      this.ready();
    });
    this.bot.on('interactionCreate', (interaction) => {
      this.listen(interaction);
    });

    await this.bot
      .login(this.config.token)
      .then(() => {
        this.logger.info(`Meowmo logged in as ${this.bot.user?.tag}`);
      })
      .catch((error) => {
        this.logger.error('Meowmo failed to log in', error);
      });

    this.loader = new Loader(
      this.logger.child({ module: 'Loader' }),
      this.api,
      this.config.guildId,
    );
  }

  public listen(interaction: Interaction): void | Error {
    if (!interaction.isCommand()) return;

    this.logger.info(`Meowmo received command from ${interaction.user.tag}`);
    try {
      this.loader.load(interaction);
    } catch (error) {
      this.logger.error('Error processing command', error as Error);
      this.logger.warn('Command execution failed');
    }
  }

  public abstract ready(): void | Error;

  public abstract panic(error?: Error): void;

  public abstract stop(): void;
}

export default MeowmoCore;
