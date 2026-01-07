import "dotenv/config";
import { createBot } from "./Telegram-Bot/bot.js";

import express from "express";
import cors from "cors";

import { displayLuckyNumbers } from "./scraper/scraperInit.js";
import {
  readScrapedData,
  writeScrapedData,
} from "./scraper/scrapedDataStorage.js";

// BOT
const bot = createBot(process.env.BOT_TOKEN);
const chatId = process.env.CHAT_ID;

bot.launch();

// legge e invia i numeri al comando /start
bot.start(async (ctx) => {
  const numbersToSend = await readScrapedData();

  if (numbersToSend?.value == null) {
    await ctx.reply(chatId, "Numeri non disponibili");
    return;
  }

  const {
    value: [sixNumbers, superStar],
  } = numbersToSend;

  const formattedNumbers = sixNumbers[0].replaceAll(" ", "\u2009");
  const numbersAndSuperStar = `${formattedNumbers}\n⭐ ${superStar}`;

  await ctx.reply(numbersAndSuperStar);
});

// funzione che fa lo scraping e scrive/aggiorna i numeri salvati nel file json
async function updateScraping() {
  let scrapedValue;

  do {
    scrapedValue = await displayLuckyNumbers(); // dati oppure {}
    if (Object.keys(scrapedValue).length === 0) return { value: null };
  } while (!scrapedValue);

  const currentScrapedData = await readScrapedData();

  if (scrapedValue !== currentScrapedData.value) {
    await writeScrapedData(scrapedValue);
  }
}

// avvia scraping all'avvio del server
updateScraping();

// Scraping automatico ogni ora
setInterval(updateScraping, 1000 * 60 * 60);

// EXPRESS
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

// legge file con i numeri
app.get("/api/data", async (req, res) => {
  const data = await readScrapedData();
  res.json(data);
});

// SOLO PER FRONTEND: legge file con numeri e invia a telegram
app.post("/api/telegram-bot", async (req, res) => {
  try {
    const numbersToSend = await readScrapedData();

    if (numbersToSend?.value == null) {
      await bot.telegram.sendMessage(chatId, "Numeri non disponibili");
      return res.json({ status: "Numeri non disponibili" });
    }

    const {
      value: [sixNumbers, superStar],
    } = numbersToSend;

    // formattazione per WhatsApp
    const formattedNumbers = sixNumbers[0].replaceAll(" ", "\u2009");
    const numbersAndSuperStar = `${formattedNumbers}\n⭐ ${superStar}`;

    await bot.telegram.sendMessage(chatId, numbersAndSuperStar);

    return res.json({ status: "Messaggio inviato su Telegram" });
  } catch (error) {
    return res.status(500).json({ message: "Errore nell'invio" });
  }
});

app.listen(3001, () => {
  console.log("Server avviato su http://localhost:3001");
});
