import MeowmoCore from '@/MeowmoCore';
import Ping from '@/events/commands/common/Ping';
import { ActivityType } from 'discord.js';

export class Meowmo extends MeowmoCore {
  public ready(): void | Error {
    this.logger.info('Meowmo ready!');

    this.logger.info('Setting up presence');
    setInterval(
      () => {
        this.bot.user?.setPresence({
          activities: [
            {
              name: 'Meow!',
              state: '🐱 Meow! Mouuu!',
              type: ActivityType.Custom,
            },
          ],
        });
      },
      1000 * 60 * 5,
    );

    this.logger.info('Meowmo registering commands');
    try {
      this.loader.register(this.bot, [
        // Add your commands here
        new Ping(),
      ]);
    } catch (error) {
      this.logger.error('Error registering commands', error as Error);
      this.logger.warn('No commands registered');
    }
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
    this.bot.destroy();
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
