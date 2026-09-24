import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { sendEmbed } from '../../utils/embedBuilder';

export const data = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Warn the tagged user")
  .addUserOption(option => 
    option.setName("target")
    .setDescription("The user you want to warn")
    .setRequired(true)
  ).addStringOption(option => 
    option.setName("reason")
    .setDescription("Write a short reason for the warn")
    .setRequired(true)
  ).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  if (!interaction.guild) {
    const error = sendEmbed({ title: "Error", description: "This command is only available to guilds" })
    return interaction.editReply({embeds: [error]})
  }

  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');

  try {
    const message = sendEmbed({ title: "Warn", description: `The user ${target} has been warned because of the reason: ${reason ? reason : 'NO REASON PROVIDED'}`});
    await interaction.editReply({ embeds: [message] })
  } catch (error) {
    console.error(error);
    await interaction.editReply({ 
        content: 'Failed to warn the user. Check if you have Manage Server or if my permissions are correct.', 
    });
  }
}
