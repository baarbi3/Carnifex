import { Client } from "discord.js";
import { mediaSpam } from "./mediaSpam";
import { emojiSpam } from "./emojiSpam";
import { capsSpam } from "./capsSpam";

export async function loadAutomod(client: Client) {
  mediaSpam(client);
  emojiSpam(client);
  capsSpam(client);
}