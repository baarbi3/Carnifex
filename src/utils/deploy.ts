import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { REST, Routes } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: any[] = [];
const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl);
        
        if (command && 'data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
    console.error("Missing TOKEN or CLIENT_ID in environment variables.");
    process.exit(1);
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} global application (/) commands.`);
        
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
