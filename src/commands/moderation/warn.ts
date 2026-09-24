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
    .setDescription("Write a short reason for the kick")
    .setRequired(true)
  ).setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

