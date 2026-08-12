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
    .setRequired(true)
  ).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction) {
  interaction.deferReply();
  if (!interaction.guild) {
    const error = sendEmbed({ title: "Error", description: "This command is only available to guilds" })
    return interaction.reply({embeds: [error]})
  }

  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');
  const duration = interaction.options.getString('duration')
  
  try {
    if (!target || !reason || !duration){ 
      return interaction.editReply("COMMAND FAILED: REASON OR TARGET OR DURATION NOT PROVIDED"); // Only adding this due to typescript crying, I don't think Discord will let such happen
    }
    let formattedDuration = convertDate(duration);
    if (!formattedDuration) return null;
    
    const timeoutUntil = Math.floor(
      (Date.now() + formattedDuration) / 1000
    );

    if (interaction.guild && formattedDuration) {
      const user = await interaction.guild.members.fetch(target.id);
      await user.timeout(formattedDuration, reason);    
    }

    const message = sendEmbed({ title: "Timeot", description: `The user ${target} has been muted till <t:${timeoutUntil}:R> because of the reason: ${reason}`});
    await interaction.editReply({ embeds: [message] })
  } catch (error) {
      console.error(error);
      await interaction.editReply({ 
          content: 'Failed to timeout the user. Check my permissions or role hierarchy.', 
      });
  }
}