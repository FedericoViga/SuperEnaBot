import UserAgent from "user-agents";
import puppeteer from "puppeteer";
import "dotenv/config";

// SCRAPING NUMERO SUPERSTAR
export default async function fetchSuperStarNumber(
  scrapedNumbs,
  maxRetries = 5
) {
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

      await page.goto(process.env.URL_SUPERSTAR, {
        waitUntil: "load",
        referer: "https://www.google.it/",
      });

      const scrapedSuperStarPage = await page.evaluate(() => {
        const hookElement = Array.from(
          document.querySelectorAll(".regularPara")
        ).filter((parent) =>
          parent.firstElementChild.textContent.includes("Frequenti SuperStar")
        );

        const mostCommonTable = hookElement[0].nextElementSibling;
        const superStarNumber =
          mostCommonTable.querySelector(".td0").textContent;

        return superStarNumber;
      });
      return [scrapedNumbs, scrapedSuperStarPage];
    } catch (error) {
      attempt++;
      console.warn(`Tentativo ${attempt} fallito: ${error.message}`);
      await new Promise((r) => setTimeout(r, attempt * 400)); // pausa prima del retry
    } finally {
      if (browser) await browser.close();
    }
  }

  // ritorna oggetto vuoto se tutti i tentativi di scraping falliscono
  return {};
}
