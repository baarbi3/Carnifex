import { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export function checkBypassRole(client: Client, message: OmitPartialGroupDMChannel<Message>) {
  if (!message.guildId) return;

  const guild = client.guilds.cache.get(message.guildId);
  const user = guild?.members.cache.get(message.author.id);

  return user?.roles.cache.has("1415018804823724194")
}