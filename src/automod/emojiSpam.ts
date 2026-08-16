import { Client } from "discord.js";
import { general_chat } from "../../config"
import { checkBypassRole } from "../utils/checkBypassRole";

export async function emojiSpam(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (checkBypassRole(client, message)) return;
    // General Chat only
    if (message.channel.id !== general_chat) return;

    const content = message.content.trim();

    if (!content) return;

    // Remove custom Discord emojis
    const withoutCustomEmojis = content.replace(
      /<a?:\w+:\d+>/g,
      ""
    );

    // Extract Unicode emojis
    const unicodeEmojis = withoutCustomEmojis.match(
      /\p{Extended_Pictographic}/gu
    ) ?? [];

    // Remove Unicode emojis and whitespace
    const remainingText = withoutCustomEmojis
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/\s/g, "");

    // Must contain ONLY emojis
    if (remainingText.length > 0) return;

    // Count both Unicode + custom Discord emojis
    const customEmojiCount =
      (content.match(/<a?:\w+:\d+>/g) ?? []).length;

    const totalEmojiCount =
      unicodeEmojis.length + customEmojiCount;

    if (totalEmojiCount > 4) {
      await message.delete();

      await message.channel.send(
        "Your text was removed due to emoji spam."
      );
    }
  });
}