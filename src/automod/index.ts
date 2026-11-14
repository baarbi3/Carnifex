import { Client } from "discord.js";
import { mediaSpam } from "./mediaSpam";
import { emojiSpam } from "./emojiSpam";
import { capsSpam } from "./capsSpam";
import { checkBlacklist } from "./blacklist";

export async function loadAutomod(client: Client) {
  mediaSpam(client);
  emojiSpam(client);
  capsSpam(client);
  checkBlacklist(client);
}