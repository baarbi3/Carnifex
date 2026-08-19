import { Client } from "discord.js";
import { checkBypassRole } from "../utils/checkBypassRole";
import { sleep } from "../utils/sleep";

export async function capsSpam(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.length <= 50) return;
    if (checkBypassRole(client, message)) return;

    const letters = message.content.match(/[a-zA-Z]/g) ?? [];

    if (letters.length === 0) return;

    const uppercase = letters.filter(char => char === char.toUpperCase());

    const uppercasePercentage = uppercase.length / letters.length;

    if (uppercasePercentage > 0.7) {
      const warning = await message.channel.send(
        `${message.author}, please stop spamming caps.`
      );
      await message.delete();

      await sleep(5000);
      await warning.delete();

    }
  });
}