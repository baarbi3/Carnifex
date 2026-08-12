import { Client, GatewayIntentBits } from "discord.js";

// Defining a fresh client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user?.tag}`)
});

client.login(process.env.TOKEN);