import { Client } from "discord.js";
import { general_chat } from "../../config"

const mediaUsers = new Map<string, number>();

export async function mediaSpam(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.channel.id !== general_chat) return;
    if (message.author.bot) return;

    const hasMedia =
      message.attachments.size > 0 ||
      message.embeds.some(
        embed =>
          embed.url?.toLowerCase().includes(".gif") ||
          embed.image?.url?.toLowerCase().includes(".gif")
      );

    if (!hasMedia) return;

    const now = Date.now();
    const lastMedia = mediaUsers.get(message.author.id);

    if (lastMedia && now - lastMedia < 45_000) {
      await message.channel.send(
        `${message.author}, please wait 45 seconds before sending another attachment in general`
      );

      await message.delete();
    }

    mediaUsers.set(message.author.id, now);
  });
}