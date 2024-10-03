const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("death")
    .setDescription("This will calc what items are good for death's coffer."),
  async execute(interaction) {
    await interaction.reply("Not implemented yet.");
  },
};
