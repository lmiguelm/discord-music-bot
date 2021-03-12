import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';

const app = new Discord.Client();
app.login(process.env.BOT_TOKEN);

app.on('ready', () => {
	console.log('Bot online');
});