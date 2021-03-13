import { Emitter } from './../emitter'; 

import search, { VideoSearchResult } from 'yt-search';
import ytld from 'ytdl-core-discord';
import { Message } from 'discord.js';

import { QUEUE } from '../index';

export const Play = {
	async searchSong(text: string): Promise<VideoSearchResult | undefined> {
		try {
			const { videos } = await search(text);
			return videos[0];
		} catch (e) {
			Emitter.emit('error', `Desculpe. Não consegui encontrar nenhuma musica com o nome ${text}. :(`);
		}
	},
  
	async playSong(video: VideoSearchResult, args: Message): Promise<void> {
		try {
			// conectar o bot no canal de voz
			const conn = await args.member?.voice.channel?.join();
			
			// tocando musica no server
			const watcher = conn?.play(
				await ytld(
					video.url,
					{
						highWaterMark: 1 << 25,
						filter: 'audioonly',
						quality: 'highestaudio'
					}
				),
				{
					type: 'opus'
				}
			);

			Emitter.emit('current-music-playing', video);
      
			// Qunando a musica acabar...
			watcher?.on('finish', () => {
				QUEUE.shift();
				if(QUEUE.length == 0) {
					conn?.disconnect();
					Emitter.emit('notify-disconnect');
				} else {
					Emitter.emit('play-song', QUEUE[0]);
				}
				Emitter.emit('set-queue', QUEUE);
			}); 
		} catch (e) {
			Emitter.emit('error', `Desculpe. Não consegui tocar: ${video.title}.`);
		}
	}
};