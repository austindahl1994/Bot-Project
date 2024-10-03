const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("best")
    .setDescription("Will find best item flips with math magic."),
  async execute(interaction) {
    await interaction.reply("Not implemented yet.");
  },
};
