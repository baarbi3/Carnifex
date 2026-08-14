import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./utils/commandHandler";
import { loadAutomod } from "./automod";
import { configDotenv } from "dotenv";

configDotenv({
    path: "./.env"
});



// Defining a fresh client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await loadCommands(client);
await loadAutomod(client);

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}`)
});

client.login(process.env.TOKEN);