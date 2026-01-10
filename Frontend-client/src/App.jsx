import { useEffect, useState } from "react";

import {
  getExtractionDay,
  getNextExtractionDate,
  translateExtractionDay,
} from "./utils/extractionDay";
import { getYear } from "date-fns";

import TelegramButton from "./TelegramButton";
import SpinnerInset from "./SpinnerInset";
import ArrowTopRightIcon from "./icons/ArrowTopRightIcon";
import StarIcon from "./icons/StarIcon";

function App() {
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [superStarNumber, setsuperStarNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const nextExtractionDay = getExtractionDay();
  const nextExtractionDate = getNextExtractionDate();
  const [{ italianDay }] = translateExtractionDay(nextExtractionDay);

  const currentYear = getYear(new Date());

  useEffect(() => {
    async function fetchLuckyNumbers() {
      setIsLoading(true);
      const res = await fetch("http://localhost:3001/api/data");
      const fetchedNumbers = await res.json();

      if (fetchedNumbers.value === null) {
        setLuckyNumbers(null);
        setsuperStarNumber(null);
        setIsLoading(false);
        return;
      }

      const {
        value: [sixNumbers, superStar],
      } = fetchedNumbers;
      setLuckyNumbers(sixNumbers);
      const matchedSuperstar = superStar.match(/\d+/);
      setsuperStarNumber(matchedSuperstar[0]);

      setIsLoading(false);
    }
    fetchLuckyNumbers();
  }, []);

  async function handleClick() {
    setIsSending(true);
    try {
      const res = await fetch("http://localhost:3001/api/telegram-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      console.log(response.status);
    } catch (error) {
      console.error("Errore invio messaggio Telegram", error);
    } finally {
      setTimeout(() => {
        setIsSending(false);
      }, 1500);
    }
  }

  return (
    <div className="flex bg-linear-to-t from-slate-900 to-slate-700 min-h-dvh flex-col items-center justify-center gap-10 text-center text-gray-50">
      <h1 className="text-primary text-5xl font-bold flex gap-4">
        <span>I tuoi numeri</span>
        <img
          aria-label="Superenalotto"
          src="/superenalotto-raw.png"
          alt="Logo SuperEnalotto"
          className="h-14"
        />
      </h1>

      {/* Prossima estrazione */}
      <h2 className="text-2xl">
        Prossima estrazione:{" "}
        <span className="font-bold">
          {nextExtractionDay === "Oggi"
            ? "Oggi"
            : `${italianDay} ${nextExtractionDate}`}
        </span>
        <p className="flex gap-1 text-sm mt-2 text-slate-400 items-center justify-center">
          <span>La data di estrazione varia per i </span>
          <a
            className="text-slate-300 underline"
            href="https://presidenza.governo.it/ufficio_cerimoniale/cerimoniale/giornate.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            giorni festivi
          </a>
          <ArrowTopRightIcon />
        </p>
      </h2>

      <div className="flex flex-col gap-2 px-5">
        {isLoading ? (
          <SpinnerInset />
        ) : (
          <div className="mx-auto mt-14 mb-7 flex flex-col items-center justify-center">
            {/* Sei numeri */}
            <div className="flex justify-center items-center gap-5">
              {/* Numeri non disponibili */}
              {luckyNumbers === null && (
                <p className="text-3xl">
                  Numeri non disponibili. Riprova più tardi, grazie.
                </p>
              )}

              {/* Numeri disponibili */}
              {luckyNumbers.length > 0 &&
                luckyNumbers[0].split(" ").map((element, i) => {
                  return (
                    <p
                      className="rounded-full p-4 border-2 border-amber-100 text-4xl text-center"
                      key={i}
                    >
                      {element}
                    </p>
                  );
                })}
            </div>

            {/* Numero uperStar */}
            <div className="relative flex items-center justify-center">
              {superStarNumber === null ? (
                <p className="text-3xl">
                  Numero SuperStar non disponibile. Riprova più tardi, grazie.
                </p>
              ) : (
                <>
                  <StarIcon />
                  <p className="text-4xl absolute mt-1 text-center">
                    {superStarNumber}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <TelegramButton onClick={handleClick} onSending={isSending} />

      <span className="text-primary fixed bottom-2">
        {currentYear} Federico Viganò
      </span>
    </div>
  );
}

export default App;
