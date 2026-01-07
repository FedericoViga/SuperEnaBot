import fetchSuperStarNumber from "./fetchSuperstar.js";
import fetchStatNumbers from "./fetchStatNumbers.js";

// Funzione wrapper per eseguire sequenzialmente le funzioni asincrone di scraping e la funzione finale che genera i numeri da giocare
export async function displayLuckyNumbers() {
  try {
    const result1 = await fetchNumbersWithRetry();
    const result2 = await fetchSuperStarNumber(result1);
    return getLuckyNumbers(result2);
  } catch (err) {
    console.error(err);
  }
}

// FUNZIONE WRAPPER PER ESEGUIRE PIÙ TENTATIVI DI SCRAPING DEL SITO DELLE STATISTICHE
async function fetchNumbersWithRetry(maxAttempts = 4) {
  const MAX_ATTEMPT_DELAY = 3000;
  const MIN_ATTEMPT_DELAY = 1400;

  /* delay variabile (random) prima di eseguire un altro tentativo di scraping */
  const randomDelay = Math.floor(
    Math.random() * (MAX_ATTEMPT_DELAY - MIN_ATTEMPT_DELAY) + MIN_ATTEMPT_DELAY
  );

  // il loop serve per eseguire altri tentativi di scraping se i dati non sono completi
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`\nTentativo \x1b[33m${attempt}\x1b[0m...`);
      const scrapedStatPage = await fetchStatNumbers(); // funzione di scraping statistiche da ritentare
      const [mostCommon, leastCommon] = scrapedStatPage;

      // fetchStatNumbers ritorna un array con due sub-array, controlla se almeno uno dei due sub-array è vuoto
      // se è vuoto passa all'iterazione successiva e riprova lo scraping
      if (
        (mostCommon && mostCommon.length) > 0 &&
        (leastCommon && leastCommon.length) > 0
      ) {
        console.log("\x1b[32mNumeri ottenuti\x1b[0m");
        return scrapedStatPage;
      } else {
        console.warn(
          "\x1b[33mAlmeno uno dei due sub-array è vuoto, riprovo...\x1b[0m"
        );
      }
    } catch (err) {
      console.warn("Errore durante il fetch:", err.message);
    }

    // wrappare il setTimeout in una Promise permette di fare await del resolve della Promise in base al valore di randomDelay
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
    }
  }
  // ritorna oggetto vuoto se tutt i tentativi di scraping falliscono
  return {};
}

// calcolo dei 6 numeri + numero SuperStar
function getLuckyNumbers(fetchedNumbers) {
  if (Object.keys(fetchedNumbers).length === 0) return {};

  const [[mostCommonNumbers, leastCommonNumbers], superStarNumber] =
    fetchedNumbers;

  // filtra i numeri più comuni per i numeri che non escono da almeno 10 estrazioni
  const mostCommonByFrequency = mostCommonNumbers
    .filter((numberObj) => numberObj.currentDelay >= 10)
    .sort((a, b) => b.currentDelay - a.currentDelay);

  // ordina i numeri meno comuni in ordine decrescente per ritardo di uscita
  const leastCommonByFrequency = leastCommonNumbers.sort(
    (a, b) => b.currentDelay - a.currentDelay
  );

  if (mostCommonByFrequency.length === 6) {
    return [mostCommonByFrequency, superStarNumber];
  }

  const TOTAL_NUMBERS = 6;
  // quantità di numeri da aggiungere ai numeri finali (6 - numeri più comuni filtrati)
  const numbersToAdd = TOTAL_NUMBERS - mostCommonByFrequency.length;
  // prende una quantità X di numeri da quelli meno comuni dove X è il valore di numbersToAdd
  const addedNumbers = leastCommonByFrequency.slice(0, numbersToAdd);

  // nuovo array che unisce gli oggetti dei numeri più comuni e meno comuni
  const finalArray = [...addedNumbers, ...mostCommonByFrequency].sort(
    (a, b) => a.number - b.number
  );

  // stringa dei 6 numeri
  const luckyNumbers = finalArray.reduce((numbers, currentNumber) => {
    return (numbers += `${currentNumber.number} `);
  }, "");

  // stringhe finali formattate 6 numeri + numero SuperStar
  /* console.log(`\x1b[33m${luckyNumbers.trim()}\x1b[0m`);
  console.log("Numero SuperStar:", `\x1b[33m${superStarNumber}\x1b[0m`); */

  const formattedLuckyNumbers = [[luckyNumbers.trim()], superStarNumber];

  return formattedLuckyNumbers;
}
