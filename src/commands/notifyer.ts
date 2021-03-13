import { VideoSearchResult } from 'yt-search';
import { Message } from 'discord.js';

export const Notifyer = {
	currentMusicPlaying(video: VideoSearchResult, args: Message): void {
		args.reply(`Tocando ${video.title} de ${video.author.name}`);
	},

	disconnect(args: Message): void {
		args.reply('Opa !! Não tenho mais musicas. Quando quiser ouvir mais, só me chamar :)');
	}
};