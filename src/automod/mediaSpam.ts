import { Client } from "discord.js";

const mediaUsers = new Map<string, number>();

export async function mediaSpam(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.channel.id !== "1535628880663019630") return;
    if (message.author.bot) return;
    if (message.attachments.size === 0) return;

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