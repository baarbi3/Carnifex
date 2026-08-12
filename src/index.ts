import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./utils/commandHandler";

// Defining a fresh client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

await loadCommands(client);

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}`)
});

client.login(process.env.TOKEN);