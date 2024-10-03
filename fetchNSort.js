import { readFile, writeFile } from "fs/promises";

const fetchData = async () => {
  try {
    const response = await fetch(
      "https://prices.runescape.wiki/api/v1/osrs/mapping"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    await writeFile("itemsWInfo.json", JSON.stringify(data));
    console.log(`Data saved to items.json`);
  } catch (error) {
    console.log(error);
  }
};

const sortData = async () => {
  try {
    //have to re-fetch data from /mapping and save itemsWInfo.json
    const data = await readFile("./itemsWInfo.json", "utf8");
    const jsonData = await JSON.parse(data);
    const sortedData = jsonData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    await writeFile("sortedItems.json", JSON.stringify(sortedData));
  } catch (error) {
    console.log(error);
  }
};
