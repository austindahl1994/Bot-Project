const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs").promises;
const api = "http://localhost:4000/fetch-single";

const allItems = async () => {
  try {
    const rawdata = await fs.readFile("./data/sortedItems.json", "utf8");
    const wordsData = JSON.parse(rawdata);
    return wordsData;
  } catch (error) {
    console.error("Error reading sortedItems.json:", error);
    throw error;
  }
};

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("p")
    .setDescription("Item Information for: ")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Looking up item")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const value = interaction.options.getFocused().toLowerCase();
    try {
      const items = await allItems(); //can wait for API call instead
      const filtered = items
        .filter((choice) => choice.name.toLowerCase().includes(value))
        .slice(0, 5);
      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.name,
          value: choice.id.toString(),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  },

  async execute(interaction) {
    const itemId = parseInt(interaction.options.getString("item")); //gets the value from autocomplete
    const initialReply = await interaction.reply("Looking up item...");
    try {
      //console.log("attempting to fetch data");
      const listItems = await allItems();
      const selectedItem = listItems.filter((n) => n.id === itemId);
      const changedString = selectedItem[0].name.split(" ");
      const selectedName = changedString.join("_");
      const apiData = await fetch(`${api}?item=${itemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await apiData.json();
      const itemData = data.data[itemId];
      const difference = itemData.high - itemData.low;
      //console.log(difference);
      const tax = Math.max(parseFloat(itemData.high) * 0.01, 1);
      const potentialProfit =
        difference <= 0
          ? "Innaccurate Data"
          : difference * selectedItem[0].limit - Math.min(tax, 5000000);
      //console.log(potentialProfit);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setThumbnail(
          `https://oldschool.runescape.wiki/images/${
            selectedName.charAt(0).toUpperCase() + selectedName.slice(1)
          }_detail.png?`
        )
        .setTitle(`${selectedItem[0].name}`)
        .setURL(
          `https://oldschool.runescape.wiki/w/${
            selectedName.charAt(0).toUpperCase() + selectedName.slice(1)
          }`
        )
        .setDescription(`${selectedItem[0].examine}`)
        .addFields(
          {
            name: "High",
            value: `${itemData.high.toLocaleString()}`,
            inline: true,
          },
          {
            name: "Low",
            value: `${itemData.low.toLocaleString()}`,
            inline: true,
          },
          {
            name: "Limit",
            value: `${selectedItem[0].limit}`,
            inline: true,
          },
          {
            name: "Potential Profit",
            value: `${(
              Math.round(potentialProfit / 1000) * 1000
            ).toLocaleString()}`,
            inline: true,
          },
          {
            name: "Tax",
            value: `${tax.toLocaleString()}`,
            inline: true,
          }
        )
        .setTimestamp();
      // .setFooter({ text: "Some footer text here" });
      await initialReply.edit({ content: null, embeds: [embed] });
      // await initialReply.edit(
      //   `Item Name:${
      //     selectedItem[0].name
      //   } ID:${itemId} with high: ${itemData.high.toLocaleString()} and low: ${itemData.low.toLocaleString()}`
      // );
    } catch (error) {
      await initialReply.edit(
        `Error searching for item of ID: ${itemId}, error of ${error}`
      );
    }
  },
};
