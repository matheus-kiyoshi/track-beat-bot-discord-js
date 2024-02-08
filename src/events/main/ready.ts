import { client } from "../../main";
import { Event } from "../../structs/types/Event";

export default new Event({
  name: "ready",
  once: true,
  run: () => {
    const { commands, buttons, selects, modals } = client

    console.log("BOT ONLINE!")
    console.log(`Commands loaded: ${commands.size}`)
    console.log(`Buttons loaded: ${buttons.size}`)
    console.log(`Selects loaded: ${selects.size}`)
    console.log(`Modals loaded: ${modals.size}`)
  }
})