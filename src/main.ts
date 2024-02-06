import { ExtendedClient } from "./structs/ExtendedClient";

export const client = new ExtendedClient();

client.start();

client.on("ready", () => {
  console.log(`Bot is ready!`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});