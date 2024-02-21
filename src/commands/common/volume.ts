import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, Collection } from "discord.js";
import { Command } from "../../structs/types/Command";
import { useQueue } from "discord-player";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";

export default new Command({
  name: "volume",
  type: ApplicationCommandType.ChatInput,
  description: "Change bot volume",
  options: [
    {
      name: 'volume',
      type: ApplicationCommandOptionType.Integer,
      description: 'Number between 0-100',
      required: true,
    },
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply();

    let volume = interaction.options.data[0].value as number;
    volume = Math.max(0, volume);
    volume = Math.min(100, volume);

    const queue = useQueue(interaction?.guild?.id as string);
    const inVoiceChannel = voiceChannelVerify(interaction);
    if (inVoiceChannel && queue && queue.currentTrack) queue.node.setVolume(volume);

    return void interaction.followUp({
      content: `🔊 | Volume set to ${volume}!`,
    });
  }
})