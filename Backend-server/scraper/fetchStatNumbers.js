import UserAgent from "user-agents";
import puppeteer from "puppeteer";
import "dotenv/config";

// SCRAPING DEI 6 NUMERI SUPERENALOTTO PIÙ E MENO FREQUENTI
export default async function fetchStatNumbers(maxRetries = 5) {
  let attempt = 0;

  // in caso Puppeteer fallisca, fa X tentativi massimi pari al valore di maxRetries
  while (attempt < maxRetries) {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: [
          "--disable-blink-features=AutomationControlled",
          "--lang=it-IT",
          "--incognito",
        ],
      });

      const context = browser.defaultBrowserContext();
      const page = (await context.pages())[0];

      const userAgent = new UserAgent({
        deviceCategory: "desktop",
        platform: "Win32",
      }).random();

      await page.setUserAgent(userAgent.userAgent);

      await page.setViewport({
        width: userAgent.data.viewportWidth,
        height: userAgent.data.viewportHeight,
        deviceScaleFactor: 1,
      });

      await page.goto(process.env.URL_SUPERENALOTTO, {
        waitUntil: "load",
        referer: "https://www.google.it/",
      });

      const scrapedStatPage = await page.evaluate(() => {
        // numeri più frequenti
        const mostCommonTable = Array.from(
          document.querySelectorAll(".col-half .table-body .table-entry")
        ).slice(0, 6);

        const mostCommonNumbers = mostCommonTable.map((tableRow) => ({
          number: Number(
            tableRow.querySelector(".entry-number.entry-number-1").textContent
          ),
          frequency: Number(
            tableRow.querySelector(".entry-frequency").textContent
          ),
          currentDelay: Number(
            tableRow.querySelector(".entry-current-delay").textContent
          ),
          maxDelay: Number(
            tableRow.querySelector(".entry-max-delay").textContent
          ),
        }));

        // numeri meno frequenti
        const leastCommonTable = Array.from(
          document.querySelectorAll(".col-half .table-body .table-entry")
        ).slice(6);

        const leastCommonNumbers = leastCommonTable.map((tableRow) => ({
          number: Number(
            tableRow.querySelector(".entry-number.entry-number-2").textContent
          ),
          frequency: Number(
            tableRow.querySelector(".entry-frequency").textContent
          ),
          currentDelay: Number(
            tableRow.querySelector(".entry-current-delay").textContent
          ),
          maxDelay: Number(
            tableRow.querySelector(".entry-max-delay").textContent
          ),
        }));

        return [mostCommonNumbers, leastCommonNumbers];
      });

      return scrapedStatPage;
    } catch (error) {
      attempt++;
      console.warn(`Tentativo ${attempt} fallito: ${error.message}`);
      await new Promise((r) => setTimeout(r, attempt * 400)); // pausa prima del retry
    } finally {
      if (browser) await browser.close();
    }
  }

  // ritorna array vuoto se tutti i tentativi di scraping falliscono
  return [];
}
