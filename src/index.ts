import { Meowmo } from '@/Meowmo';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const token = process.env.BOT_TOKEN;
const guildId = process.env.SERVER_ID;

if (token && guildId) {
  const meowmo = new Meowmo(token, guildId);
  meowmo.start();

  process.on('unhandledRejection', (error) => {
    meowmo.panic(error as Error);
  });

  process.on('SIGINT', () => {
    meowmo.stop();
  });
} else {
  winston.error('Token or server ID not found');
}
