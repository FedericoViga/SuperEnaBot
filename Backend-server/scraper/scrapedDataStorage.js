import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.resolve("scrapedData.json");

// legge il file json con i numeri
export async function readScrapedData() {
  try {
    const file = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(file);
  } catch {
    return { value: null, lastUpdate: null };
  }
}

// scrive i numeri nel file json
export async function writeScrapedData(value) {
  const payload = {
    value,
    lastUpdate: new Date().toISOString(),
  };

  await fs.writeFile(FILE_PATH, JSON.stringify(payload, null, 2));

  return payload;
}
