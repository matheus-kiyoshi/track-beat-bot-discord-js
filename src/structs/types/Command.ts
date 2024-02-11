import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, Interaction, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

export interface ICommand {
  client: ExtendedClient,
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
}

export type ComponentsButton = Collection<string, (Interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string, (Interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string, (Interaction: ModalSubmitInteraction) => any>

interface ICommandComponents {
  buttons?: ComponentsButton,
  selects?: ComponentsSelect,
  modals?: ComponentsModal
}

export type CommandType = 
  ApplicationCommandData & 
  ICommandComponents &
  { run (props: ICommand): any }

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false
    Object.assign(this, options)
  }
}
