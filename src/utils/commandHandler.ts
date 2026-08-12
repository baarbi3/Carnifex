import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Collection, Client, Events } from 'discord.js';

// Tell TypeScript that the standard Client class possesses the commands collection
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
    }
}

export async function loadCommands(client: Client): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Initialize the collection on your passed client instance
    client.commands = new Collection();

    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(filePath).href;
            const command = await import(fileUrl);

            if (command && 'data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
            }
        }
    }

    // Interaction Listener
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const replyOptions = { content: 'There was an error executing this command!', flags: 64 };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }
    });
}
