import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { sendEmbed } from '../../utils/embedBuilder';
import { convertDate } from '../../utils/convertDate';

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout the tagged user")
  .addUserOption(option =>
    option
      .setName("target")
      .setDescription("The user you want to mute")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("duration")
      .setDescription(
        "use length+unit, eg 10m for 10 minutes, 10s for 10 seconds, same for d & h."
      )
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("reason")
      .setDescription("Write a short reason for the mute")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  if (!interaction.guild) {
    const error = sendEmbed({
      title: "Error",
      description: "This command is only available to guilds",
    });

    return interaction.editReply({ embeds: [error] });
  }

  const target = interaction.options.getUser("target", true);
  const reason = interaction.options.getString("reason");
  const duration = interaction.options.getString("duration", true);

  try {
    const formattedDuration = convertDate(duration);

    if (!formattedDuration) {
      return interaction.editReply({
        content: "Invalid duration. Use formats such as `10s`, `10m`, `1h`, or `1d`.",
      });
    }

    const timeoutUntil = Math.floor(
      (Date.now() + formattedDuration) / 1000
    );

    const member = await interaction.guild.members.fetch(target.id);

    // DM the user before applying the timeout
    try {
      await target.send(
        `You've been timed out at ${interaction.guild.name} for the reason: ${
          reason ?? "NO REASON PROVIDED"
        }`
      );
    } catch (error) {
      console.error("Failed to DM timed-out user:", error);
      // Don't fail the timeout just because the user has DMs disabled
    }

    await member.timeout(
      formattedDuration,
      reason ?? "NO REASON PROVIDED"
    );

    const message = sendEmbed({
      title: "Timeout",
      description: `The user ${target} has been muted till <t:${timeoutUntil}:R> because of the reason: ${
        reason ?? "NO REASON PROVIDED"
      }`,
    });

    await interaction.editReply({
      embeds: [message],
    });
  } catch (error) {
    console.error(error);

    await interaction.editReply({
      content:
        "Failed to timeout the user. Check my permissions or role hierarchy.",
    });
  }
}