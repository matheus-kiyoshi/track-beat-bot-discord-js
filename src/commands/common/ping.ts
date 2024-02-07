import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, Collection } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
  name: "ping",
  type: ApplicationCommandType.ChatInput,
  description: "Reply with Pong!",
  run: ({ interaction }) => {
    const row = new ActionRowBuilder<ButtonBuilder>({ components: [
      new ButtonBuilder({ label: "Clique Aqui!", customId: "button", style: ButtonStyle.Success })
    ]})
    
    interaction.reply({ content: "Pong!", components: [row]});
  },
  buttons: new Collection([
    ["button", async (interaction) => {
      interaction.reply({ content: "Você clicou no botão!", ephemeral: true })
    }]
  ])
})