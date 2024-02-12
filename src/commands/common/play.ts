import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { useMainPlayer } from "discord-player";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";

export default new Command({
  name: "play",
  type: ApplicationCommandType.ChatInput,
  description: "Play a song by name or URL",
  options: [
    {
      name: "query",
      description: "The song name or URL",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async ({ interaction }) => {
    try {
      const isInVoiceChannel = voiceChannelVerify(interaction);
      if (!isInVoiceChannel) return;
  
      const query = interaction.options.data[0].value as string;
      await interaction.deferReply();
      
      const player = useMainPlayer()
      const searchResult = await player.search(query)
      if (!searchResult.hasTracks()) return void interaction.followUp({content: 'No results were found!'});
      
      await interaction.editReply({
          content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
      });

      try {
        await player.play(interaction.member?.voice.channel.id, searchResult, {
            nodeOptions: {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild?.members.me,
                    requestedBy: interaction.user.username,
                },
                leaveOnEmptyCooldown: 300000,
                leaveOnEmpty: true,
                leaveOnEnd: false,
                bufferingTimeout: 0,
                volume: 10,
            },
        });

        await interaction.editReply({
            content: `🎶 | Now playing: [${searchResult.playlist ? 'Playlist' : 'Track'}](${searchResult.playlist ? searchResult.tracks[0].url : searchResult.tracks[0].url}) - \`${searchResult.playlist ? searchResult.tracks.length : ''}${searchResult.tracks[0].title}\``,
        });
      } catch (error: any) {
          await interaction.editReply({
              content: 'An error has occurred: ' + error.message,
          });
          return console.log(error);
      }
    } catch (error: any) {
      await interaction.reply({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
      return console.log(error);
    }
  }
})