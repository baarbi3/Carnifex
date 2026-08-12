import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { sendEmbed } from '../../utils/embedBuilder';
import { convertDate } from '../../utils/convertDate';

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout the tagged user")
  .addUserOption(option => 
    option.setName("target")
    .setDescription("The user you want to mute")
    .setRequired(true)
  ).addStringOption(option => 
    option.setName("reason")
    .setDescription("Write a short reason for the mute")
    .setRequired(true)
  ).addStringOption(option => 
    option.setName("duration")
    .setDescription('use length+unit, eg 10m for 10 minutes, 10s for 10 seconds same for d & h.')
  ).setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    const error = sendEmbed({ title: "Error", description: "This command is only available to guilds" })
    interaction.reply({embeds: [error]})
  }

  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');
  const duration = interaction.options.getString('duration')
  
  try {
    if (!target || !reason || !duration){ 
      return interaction.reply("COMMAND FAILED: REASON OR TARGET OR DURATION NOT PROVIDED"); // Only adding this due to typescript crying, I don't think Discord will let such happen
    }
    let formattedDuration = convertDate(duration);

    if (interaction.guild && formattedDuration) {
      const user = await interaction.guild.members.fetch(target.id);
      await user.timeout(formattedDuration, reason);    
    }

    const message = sendEmbed({ title: "Timeot", description: `The user ${target} has been muted till <t:${formattedDuration}:R> because of the reason: ${reason}`});
    await interaction.reply({ embeds: [message] })
  } catch (error) {
      console.error(error);
      await interaction.reply({ 
          content: 'Failed to timeout the user. Check my permissions or role hierarchy.', 
          ephemeral: true 
      });
  }
}