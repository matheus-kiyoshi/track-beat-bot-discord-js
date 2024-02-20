import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { voiceChannelVerify } from "../../utils/voiceChannelVerify";
import { QueryType, useMainPlayer, useQueue } from "discord-player";

export default new Command({
  name: "playnow",
  type: ApplicationCommandType.ChatInput,
  description: "Play a song before the next song in the queue",
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
      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      })
      if (!searchResult.hasTracks()) return void interaction.followUp({content: 'No results were found!'});
      
      await interaction.editReply({
          content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
      });

      const queue = useQueue(interaction.guild?.id as string);
      try {
        if (!queue || !queue.connection) await queue?.connect(interaction.member?.voice.channel as any);

        searchResult.playlist 
          ? searchResult.playlist.tracks.map((track, index) => queue?.node.insert(track, index))
          : queue?.node.insert(searchResult.tracks[0], 0);  

        !queue?.currentTrack && await player.play()

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
