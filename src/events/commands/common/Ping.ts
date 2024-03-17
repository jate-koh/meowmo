import Command, { CommandData } from '@/events/commands/Command';
import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export class Ping implements Command {
  public data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .toJSON();

  public async run(interaction: CommandInteraction): Promise<void> {
    const { tag } = interaction.user || {};
    const { ping } = interaction.client.ws;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: tag,
      })
      .setTitle('Pong!')
      .setDescription(`🏓 Ping: ${ping}ms`);

    await interaction.reply({ embeds: [embed] });
  }

  public getCommandData(): CommandData {
    return this.data;
  }
}

export default Ping;
