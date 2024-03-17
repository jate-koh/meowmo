import { Interaction } from 'discord.js';

export interface CoreBot {
  start(): Promise<void | Error>;
  stop(): void;
  ready(): void | Error;
  listen(interaction: Interaction): void | Error;
  panic(error?: Error): void;
}

export default CoreBot;
