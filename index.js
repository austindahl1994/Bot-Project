import app from "./app.js";
import { bot } from "./bot.cjs";
import { config } from "dotenv";
import fetch from "node-fetch";
const singleItemApi = "https://prices.runescape.wiki/api/v1/osrs/latest?id=";

config();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Server running");
});

app.get("/fetch-single", async (req, res) => {
  const itemId = req.query.item;
  //console.log(itemId);
  try {
    const apiData = await fetch(`${singleItemApi}${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot project - @itzdubz",
      },
    });
    const data = await apiData.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

bot();
