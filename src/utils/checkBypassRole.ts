import { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export function checkBypassRole(
  client: Client,
  message: OmitPartialGroupDMChannel<Message>
) {
  if (!message.guildId) return false;

  const bypassRoles = [
    "1415018804823724194",
    "1347191552081924147",
  ];

  const guild = client.guilds.cache.get(message.guildId);
  const user = guild?.members.cache.get(message.author.id);

  return bypassRoles.some(roleId => user?.roles.cache.has(roleId));
}