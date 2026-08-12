import { ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { sendEmbed } from '../../utils/embedBuilder';

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a tagged user")
  .addUserOption(option => 
    option.setName("target")
    .setDescription("The user you want to ban")
    .setRequired(true)
  ).addStringOption(option => 
    option.setName("reason")
    .setDescription("Write a short reason for the ban") 
  ).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');

  try {
    if (!target || !reason){ 
      return interaction.reply("COMMAND FAILED: REASON OR TARGET NOT PROVIDED");
    }
    await interaction.guild?.members.ban(target, {reason: reason});

    const message = sendEmbed({ title: "Banned User", description: `The user ${target} has been banned for the reason: ${reason}`});
    await interaction.reply({ embeds: [message] })
  } catch (error) {
      console.error(error);
      await interaction.reply({ 
          content: 'Failed to ban the user. Check my permissions or role hierarchy.', 
          ephemeral: true 
      });
  }

}