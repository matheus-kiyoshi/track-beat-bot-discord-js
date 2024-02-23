import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";
import fs from "fs";
import ytdl from "ytdl-core";

export default new Command({
  name: "download",
  type: ApplicationCommandType.ChatInput,
  description: "Download a YouTube video as an MP3 or MP4 file",
  options: [
    {
      name: "format",
      type: ApplicationCommandOptionType.String,
      description: "The format of the downloaded file",
      required: true,
      choices: [
        { name: "mp3", value: "mp3" },
        { name: "mp4", value: "mp4" }
      ]
    },
    {
      name: "url",
      type: ApplicationCommandOptionType.String,
      description: "The URL of the YouTube video to download",
      required: true
    }
  ],
  run: async ({ interaction }) => {
    await interaction.deferReply();

    const format = interaction.options.data[0].value as string;
    const url = interaction.options.data[1].value as string;
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title.replace(/[^a-z0-9]/gi, "_");
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });

    if (!videoFormat) {
      throw new Error('Nenhum formato de vídeo/áudio encontrado com qualidade máxima.');
    }

    interaction.followUp({ content: "⏱ | Baixando o vídeo/áudio..." });

    if (format === "mp4") {
      const videoStream = ytdl(url, { quality: "highest" });
      const filePath = `./${videoTitle}.mp4`;
      videoStream.pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          if (fs.statSync(filePath).size > 25e+6) {
            interaction.followUp({ content: "❌ | O arquivo é muito grande para ser enviado no Discord (25MB limite)." });
          } else {
            interaction.followUp({ content: `✅ | Vídeo baixado como \`${videoTitle}.mp4\``, files: [filePath] });
          }
          fs.rm(filePath, (error) => {
            if (error) {
              console.error(`Erro ao deletar o arquivo ${filePath}: ${error.message}`);
            }
          });
        })
        .on("error", (error) => {
          interaction.followUp({ content: `❌ | Ocorreu um erro durante o download: ${error.message}` });
        });
    } else {
      const videoStream = ytdl(url, { quality: "highest", filter: "audioonly" });
      const filePath = `./${videoTitle}.mp3`;
      videoStream.pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          if (fs.statSync(filePath).size > 25e+6) {
            interaction.followUp({ content: "❌ | O arquivo é muito grande para ser enviado no Discord (25MB limite)." });
          } else {
            interaction.followUp({ content: `✅ | Áudio baixado como \`${videoTitle}.mp3\``, files: [filePath] });
          }
          fs.rm(filePath, (error) => {
            if (error) {
              console.error(`Erro ao deletar o arquivo ${filePath}: ${error.message}`);
            }
          });
        })
        .on("error", (error) => {
          interaction.followUp({ content: `❌ | Ocorreu um erro durante o download: ${error.message}` });
        });
    }

  }
})