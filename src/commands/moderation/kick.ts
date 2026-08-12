import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { sendEmbed } from '../../utils/embedBuilder';

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick the tagged user")
  .addUserOption(option => 
    option.setName("target")
    .setDescription("The user you want to kick")
    .setRequired(true)
  ).addStringOption(option => 
    option.setName("reason")
    .setDescription("Write a short reason for the kick")
    .setRequired(true)
  ).setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    const error = sendEmbed({ title: "Error", description: "This command is only available to guilds" })
    interaction.reply({embeds: [error]})
  }

  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');
  
  try {
    if (!target || !reason){ 
      return interaction.reply("COMMAND FAILED: REASON OR TARGET NOT PROVIDED"); // Only adding this due to typescript crying, I don't think Discord will let such happen
    }
    await interaction.guild?.members.kick(target);

    const message = sendEmbed({ title: "Kicked User", description: `The user ${target} has been kicked for the reason: ${reason}`});
    await interaction.reply({ embeds: [message] })
  } catch (error) {
      console.error(error);
      await interaction.reply({ 
          content: 'Failed to kick the user. Check my permissions or role hierarchy.', 
          ephemeral: true 
      });
  }
}