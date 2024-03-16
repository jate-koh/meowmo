import MeowmoLogger from '@/Logger';
import Loader from '@/events/Loader';
import { IntentOptions } from '@/lib/constants';
import { MeowmoConfig } from '@/lib/types';
import { Client } from 'discord.js';

export class Meowmo {
  private config: MeowmoConfig;
  private logger: MeowmoLogger;

  private loader: Loader = {} as Loader;
  private bot: Client = {} as Client;

  public constructor(token: string, guildId: string) {
    this.logger = MeowmoLogger.getInstance();
    this.config = {
      token,
      guildId,
    };
    this.logger.info('Meowmo config loaded');
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
    this.logger.warn('Meowmo shutting down');
    process.exit(1);
  }

  public stop() {
    this.logger.info('Meowmo stopping');
    this.bot.destroy();
    process.exit(0);
  }
}

export default Meowmo;
