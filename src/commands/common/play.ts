import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import { Player, useMainPlayer } from "discord-player";

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
    const query = interaction.options.data[0].value as string;
    await interaction.deferReply();
    
    const player = useMainPlayer()
    const searchResult = await player.search(query)
    if (!searchResult.hasTracks()) return void interaction.followUp({content: 'No results were found!'});

    interaction.editReply(`Playing ${searchResult.tracks[0].title}...`);
  }
})