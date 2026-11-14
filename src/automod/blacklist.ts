import { Client } from "discord.js";
import { general_chat } from "../../config";
import { checkBypassRole } from "../utils/checkBypassRole";
import { sleep } from "../utils/sleep";

const blacklistedWords = ["foid", "moid"];

export async function checkBlacklist(client: Client) {
  client.on("messageCreate", async (message) => {
    if (message.channel.id !== general_chat) return;
    if (message.author.bot) return;
    if (checkBypassRole(client, message)) return;

    blacklistedWords.map((word) => {if (message.content.includes(word)) {
      message.delete();
    }});
  })
}