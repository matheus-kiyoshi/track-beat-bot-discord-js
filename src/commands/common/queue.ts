import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { useQueue } from "discord-player";

export default new Command({
  name: "queue",
  type: ApplicationCommandType.ChatInput,
  description: "Show the current queue of songs",
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guild?.id as string);
    if (!queue || !queue.currentTrack) return void interaction.reply({content: '❌ | There is no song in the queue!'});

    const queueTracks: string[] = []
    queue.tracks.data.map(async (track, index) => {
      queueTracks.push(`${index + 1} - **${track.title}** | Artist: ${track.author}`)
    })

    const trimString = (str: string, max: number) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
    return void interaction.reply({
        embeds: [
            {
                title: 'Now Playing',
                description: trimString(
                  `The Current song playing is 🎶 | **${queue.currentTrack.title}** | 🎶\n
                  ${queueTracks.join('\n')}`
                , 4095),
            }
        ]
    })
  }  
})