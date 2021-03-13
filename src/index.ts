import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
import { VideoSearchResult } from 'yt-search';

import { Emitter } from './emitter';
import { Play } from './commands/play';
import { Notifyer } from './commands/notifyer';

export let QUEUE: VideoSearchResult[] = [];

const app = new Discord.Client();
app.login(process.env.BOT_TOKEN);

app.on('ready', () => {
	console.log('Bot started');
});

app.on('message', async msg => {

	if(msg.author.bot || !msg.content.startsWith(process.env.PREFIX as string)) return;

	const command = msg.content.split(' ')[0].trim();
	const text = msg.content.replace(process.env.PREFIX as string, '').trim();

	// EVENTS
	Emitter.on('play-song', (video: VideoSearchResult) => Play.playSong(video, msg));

	Emitter.on('current-music-playing', (video: VideoSearchResult) => Notifyer.currentMusicPlaying(video, msg));
	Emitter.on('notify-disconnect', () => Notifyer.disconnect(msg));

	Emitter.on('set-queue', (newQueue: VideoSearchResult[]) => {
		QUEUE = newQueue;
	});
	
	if(command == '!play') {
		const video = await Play.searchSong(text);
		if(video) {
			QUEUE.push(video);

			if(QUEUE.length == 1) {
				Emitter.emit('play-song', QUEUE[0]);
			} 
		}
		return;	
	}
});