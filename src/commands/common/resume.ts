import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { useQueue } from "discord-player";

export default new Command({
  name: "resume",
  type: ApplicationCommandType.ChatInput,
  description: "Resume the current track",
  run: async ({ interaction }) => {
    const inVoiceChannel = voiceChannelVerify(interaction)
    if (!inVoiceChannel) return;

    await interaction.deferReply();
    
    const queue = useQueue(interaction.guild?.id as string);
    if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | There is nothing playing!'});

    const resume = queue.node.resume();
    return void interaction.followUp({content: resume ? '⏸ | Music Resumed!' : '❌ | Something went wrong, please try again!'});
  }
})