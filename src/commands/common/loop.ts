import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { QueueRepeatMode, useQueue } from "discord-player";

export default new Command({
  name: 'loop',
  type: ApplicationCommandType.ChatInput,
  description: 'Sets loop mode',
  options: [
    {
      name: 'mode',
      type: ApplicationCommandOptionType.Integer,
      description: 'Loop type',
      required: true,
      choices: [
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ],
    },
    ],
  run: async ({ interaction }) => {
    const inVoiceChannel = voiceChannelVerify(interaction)
    if (!inVoiceChannel) return

    await interaction.deferReply();

    const queue = useQueue(interaction?.guild?.id as string)
    if (!queue || !queue.currentTrack) {
      return void interaction.followUp({content: '❌ | Não há nada tocando!'});
    }

    const loopMode = interaction.options.data[0].value as QueueRepeatMode
    queue.setRepeatMode(loopMode);
    const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

    return void interaction.followUp({
      content: `${mode} | Updated loop mode!`,
    });
  }
})