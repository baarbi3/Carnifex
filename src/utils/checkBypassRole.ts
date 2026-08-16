import { Client, Message, OmitPartialGroupDMChannel } from "discord.js";

export async function checkBypassRole(client: Client, message: OmitPartialGroupDMChannel<Message>) {
  if (!message.guildId) return;

  const guild = client.guilds.cache.get(message.guildId);
  const user = guild?.members.cache.get(message.author.id);

  if (user?.roles.cache.get("1415018804823724194")) {
    return true
  } else return false;
}