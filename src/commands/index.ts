/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUEUE } from '../index';
import { Emitter } from '../emitter';

import { Play } from '../commands/play';
import { Message } from 'discord.js';

interface IResponseFilter {
  command: string;
  text: string;
}

export const Commands: any =  {
	filter(command: string): IResponseFilter {
		const commandClear = command.split(' ')[0].replace(process.env.PREFIX as string, '');
		const text = command.replace(commandClear, '').replace(process.env.PREFIX as string, '').trim();

		return {
			command: commandClear,
			text
		};
	},

	async play(text: string): Promise<void> {
		const video = await Play.searchSong(text);
		if(video) {
			QUEUE.push(video);
			if(QUEUE.length == 1) {
				Emitter.emit('play-song', QUEUE[0]);
			} else {
				Emitter.emit('show-playlist', QUEUE);
			}
		}
	},

	help(): void {
		const msg = ` \`\`\`
!play [nome da musica] - Toca a música informada.
!skip - Pula para próxima música da playlist de repodução.
!show - Exibe a playlist de reprodução
!help - Informa os comandos uteis do bot.
!exit - Desconecta o bot.
		\`\`\``;

		Emitter.emit('information', msg.trim());
	},

	show(): void {
		Emitter.emit('show-playlist');
	},

	skip(_: any, args: Message): void {
		try {
			const nextSong = QUEUE[1];
			if(nextSong) {
				const newQueue = QUEUE.shift();
				Emitter.emit('set-queue', newQueue);
				Emitter.emit('play-song', nextSong);
				Emitter.emit('current-music-playing', nextSong);
			} else {
				Emitter.emit('set-queue', []);
				args.member?.voice.channel?.leave();
			}
		} catch (e) {
			console.log(e);
			const msg = '``` Não há mais nenhuma música na fila. ```';
			Emitter.emit('information', msg);
		}
	},

	remove(text: string): void {
		const id = Number(text) - 1;
		const queueDeleted = QUEUE[Number(id)];
		
		const newQueue = QUEUE.filter( (_, index) => index !== Number(id) );
		Emitter.emit('set-queue', newQueue);
		
		const msg = `\`\`\`${queueDeleted.title} removida da playlist de reprodução. 🤯 \`\`\``;
		Emitter.emit('information', msg);
	},

	exit(_: any, args: Message): void {
		Emitter.emit('set-queue', []);
		args.member?.voice.channel?.leave();
	}
};