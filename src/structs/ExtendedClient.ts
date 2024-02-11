import { Partials, Client, IntentsBitField, BitFieldResolvable, GatewayIntentsString, Collection, ApplicationCommandDataResolvable } from "discord.js";
import { CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { Player } from "discord-player";
dotenv.config();

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();
  fileCondition = (file: string) => file.endsWith(".ts") || file.endsWith(".js");

  constructor() {
    super({
      intents: [
        'GuildVoiceStates',
        Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public start() {
    this.registerModules();
    this.registerEvents();
    const player = new Player(this)
    player.extractors.loadDefault().then(r => console.log('Extractors loaded successfully'));
    this.login(process.env.BOT_TOKEN);
  }

  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands.set(commands)
      .then(() => console.log("Slash Commands (/) registered successfully!"))
      .catch(err => console.error(`Error registering commands: ${err}`));
  }

  private registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandsPath = path.join(__dirname, "..", "commands");

    fs.readdirSync(commandsPath).forEach(local => {
      fs.readdirSync(commandsPath + "/" + local).filter(this.fileCondition).forEach(async file => {
        const command: CommandType = (await import(`../commands/${local}/${file}`))?.default;
        const { name, buttons, selects, modals } = command 

        if (name) {
          this.commands.set(name, command);
          slashCommands.push(command);

          if (buttons)
            buttons.forEach((run, key) => this.buttons.set(key, run));
        
          if (selects)
            selects.forEach((run, key) => this.selects.set(key, run));
      
          if (modals)
            modals.forEach((run, key) => this.modals.set(key, run));
        
        }
      });
    })

    this.on("ready", () => this.registerCommands(slashCommands));
  }

  private registerEvents() {
    const eventsPath = path.join(__dirname, "..", "events");

    fs.readdirSync(eventsPath).forEach(local => {
      fs.readdirSync(eventsPath + "/" + local).filter(this.fileCondition).forEach(async file => {
        const event = (await import(`../events/${local}/${file}`))?.default;
        const { name, once, run } = event;

        try {
          if (name) (once) ? this.once(name, run) : this.on(name, run);
        } catch (err) {
          console.error(`Error loading event: ${err}`);
        }
      })
    })
  }
}