/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
import { VideoSearchResult } from 'yt-search';

import { Emitter } from './emitter';
import { Play } from './commands/play';
import { Notifyer } from './commands/notifyer';
import { Commands } from './commands';

export let QUEUE: VideoSearchResult[] = [];

const app = new Discord.Client();
app.login(process.env.BOT_TOKEN);

app.on('ready', () => {
	console.log('Bot started');
});

app.on('message', async msg => {
	if(msg.author.bot || !msg.content.startsWith(process.env.PREFIX as string)) return;

	// EVENTS
	Emitter.on('play-song', (video: VideoSearchResult) => Play.playSong(video, msg));
	Emitter.on('current-music-playing', (video: VideoSearchResult) => Notifyer.currentMusicPlaying(video, msg));
	Emitter.on('show-playlist', () => Notifyer.playList(msg, QUEUE));
	Emitter.on('information', (text: string) => Notifyer.information(msg, text));
	Emitter.on('set-queue', (newQueue: VideoSearchResult[]) => {
		QUEUE = newQueue;
	});

	try {		
		const { command, text } = Commands.filter(msg.content);
		await Commands[command as any](text, msg); 
	} catch (e) {
		console.log(e);
		Emitter.emit('information', '```Não conheço este comando 😢. Para saber todos os meus comandos digite !help ```');
	}
});