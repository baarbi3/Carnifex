import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("purge-channel")
  .setDescription("This command will purge the entire channel")
  .addBooleanOption(option => 
    option.setName("delete-all")
    .setDescription("Do you want to delete all messages")
    .setRequired(true)
  ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

