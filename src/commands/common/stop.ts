import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { useQueue } from "discord-player";

export default new Command({
  name: "stop",
  type: ApplicationCommandType.ChatInput,
  description: "Stop the current track",
  run: async ({ interaction }) => {
    const inVoiceChannel = voiceChannelVerify(interaction)
    if (!inVoiceChannel) return;

    await interaction.deferReply();
    
    const queue = useQueue(interaction.guild?.id as string);
    if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | There is nothing playing!'});

    queue.node.stop();
    return void interaction.followUp({content: '⏹ | Music Stopped!'});
  }
})