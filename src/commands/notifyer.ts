import { VideoSearchResult } from 'yt-search';
import { Message } from 'discord.js';

export const Notifyer = {
	currentMusicPlaying(video: VideoSearchResult, args: Message): void {
		args.channel.send(` \`\`\` 🔥 Reproduzindo ${video.title} de ${video.author.name} 🔥 \`\`\``);
	},

	playList(args: Message, queue: VideoSearchResult[]): void {
		const playlist = `\`\`\`${queue.map((video, index) => {
			const position = index + 1;
			switch(position) {
			case 1: return `${position}º - ${video.title} 🥇\n`;
			case 2: return `${position}º - ${video.title} 🥈\n`;
			case 3: return `${position}º - ${video.title} 🥉\n`;
			default: return `${position}º - ${video.title} \n`;
			}
		})}\`\`\``;
		
		args.channel.send(playlist.split(',').join(''));
	},

	information(args: Message, msg: string): void {
		args.channel.send(msg);
	},
};	