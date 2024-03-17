import { MeowmoOptions } from '@/lib/types';
import { GatewayIntentsString } from 'discord.js';
import path from 'path';

export const IntentOptions: GatewayIntentsString[] = [
  'Guilds',
  'GuildVoiceStates',
  'GuildMessages',
  'MessageContent',
];

export const DefaultOptions: MeowmoOptions = {
  keepLogs: false,
  logsPath: undefined,
};

export const DefaultLogPath =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../logs')
    : path.join(__dirname, '../logs');
