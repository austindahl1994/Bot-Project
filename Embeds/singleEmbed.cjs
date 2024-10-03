const { EmbedBuilder } = require("discord.js");

const singleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Item Name")
  .setURL("www.google.com")
  .setDescription("Item Description")
  .setThumbnail(
    "https://oldschool.runescape.wiki/w/File:Abyssal_whip_detail.png#/media/File:Abyssal_whip_detail.png"
  )
  .addFields(
    { name: "Field Title 1", value: "Field Value 1", inline: true },
    { name: "Field Title 2", value: "Field Value 2", inline: true },
    { name: "Field Title 3", value: "Field Value 3", inline: true },
    { name: "Field Title 4", value: "Field Value 4", inline: true }
  )
  .setTimestamp()
  .setFooter({ text: "Some footer text here" });

channel.send({ embeds: [singleEmbed] });
