import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { useQueue } from "discord-player";

export default new Command({
  name: "remove",
  type: ApplicationCommandType.ChatInput,
  description: "Remove a song from the queue",
  options: [
    {
      name: "index",
      description: "The queue index of the song to remove",
      type: ApplicationCommandOptionType.Integer,
      required: true
    }
  ],
  run: async ({ interaction }) => {
    const inVoiceChannel = voiceChannelVerify(interaction)
    if (!inVoiceChannel) return;

    await interaction.deferReply();
    
    const queue = useQueue(interaction.guild?.id as string);
    if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | There is nothing playing!'});

    const index = interaction.options.data[0].value as number - 1;
    if (index > queue.tracks.size) return void interaction.followUp({content: '❌ | The index is out of range!'});

    const removedTrack = queue.node.remove(index);
    return void interaction.followUp(
      {content: removedTrack 
        ? `🗑 | Removed: [${removedTrack.title}](${removedTrack.url})`
        : '❌ | An error occurred while trying to remove the song'
      }
    );
  }
})