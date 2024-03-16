import MeowmoLogger from '@/Logger';
import Loader from '@/events/Loader';
import { IntentOptions } from '@/lib/constants';
import { MeowmoConfig, MeowmoOptions } from '@/lib/types';
import { Client } from 'discord.js';

export class Meowmo {
  private config: MeowmoConfig;
  private logger: MeowmoLogger;
  private options: MeowmoOptions = {};

  private loader: Loader = {} as Loader;
  private bot: Client = {} as Client;

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
    }

    this.logger.setup(this.options.keepLogs, this.options.logsPath);
    if (!this.options.keepLogs) {
      this.logger.warn('Logs are not being kept as files!');
    }
    this.logger.info('Meowmo initial setup completed');
  }

  public meow() {
    this.logger.silly('Meow!');
  }

  public async start(): Promise<void | Error> {
    this.logger.info('Meowmo starting');

    this.bot = new Client({ intents: IntentOptions });
    await this.bot
      .login(this.config.token)
      .then(() => {
        this.logger.info('Meowmo logged in');
      })
      .catch((error) => {
        this.logger.error('Meowmo failed to log in', error);
      });

    this.loader = new Loader(this.logger.child({ module: 'Loader' }));
    await this.loader
      .start(this.bot)
      .then(() => {
        this.bot.once('ready', () => {
          this.logger.info('Meowmo ready');
        });
      })
      .catch((error) => {
        this.logger.error('Loader failed to start', error);
        Promise.reject(error);
      });
  }

  public panic(error?: Error) {
    if (error) {
      if (error instanceof Error) {
        this.logger.error('Meowmo panicked', error);
      } else {
        this.logger.error('Meowmo panicked', new Error('Unknown error'));
      }
    }
    this.logger.warn('Meowmo shut down unexpectedly!');
    process.exit(1);
  }

  public stop() {
    this.logger.info('Meowmo stopping');
    this.bot.destroy();
    this.logger.info('Meowmo stopped gracefully!');
    process.exit(0);
  }
}

export default Meowmo;
