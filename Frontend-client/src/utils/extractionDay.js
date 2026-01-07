import { WEEKDAY, EXTRACTION_DAYS, BILING_EXTRACTION_DAYS } from "./constants";
import { nextTuesday, nextThursday, nextFriday, nextSaturday } from "date-fns";

const d = new Date();
const today = WEEKDAY[d.getDay() - 1];

// controla se il giorno di estrazione è oggi
function isExtractionToday() {
  return EXTRACTION_DAYS.find((day) => day === today) ? "Oggi" : undefined;
}

// ottiene il giorno della prossima estrazione
function getNextExtractionDay() {
  const todayIndex = WEEKDAY.indexOf(today);

  // scorri i prossimi 7 giorni (incluso wrap settimana)
  for (let i = 1; i <= 7; i++) {
    const nextDay = WEEKDAY[(todayIndex + i) % 7];
    if (EXTRACTION_DAYS.includes(nextDay)) {
      return nextDay;
    }
  }

  return null;
}

// mostra il giorno di estrazione che può essere oggi o un giorno successivo a oggi
export function getExtractionDay() {
  const isExtracToday = isExtractionToday();
  return isExtracToday === undefined ? getNextExtractionDay() : isExtracToday;
}

// ritorna la data (1-31) del prossimo giorno di estrazione
export function getNextExtractionDate() {
  const extrDay = getExtractionDay();

  if (extrDay === "Oggi") {
    const d = new Date();
    const extractionDate = d.getDate();
    return extractionDate;
  }

  switch (extrDay) {
    case "Tuesday": {
      const date = new Date(nextTuesday(d));
      const extractionDate = date.getDate();
      return extractionDate;
    }
    case "Thursday": {
      const date = new Date(nextThursday(d));
      const extractionDate = date.getDate();
      return extractionDate;
    }
    case "Friday": {
      const date = new Date(nextFriday(d));
      const extractionDate = date.getDate();
      return extractionDate;
    }
    case "Saturday": {
      const date = new Date(nextSaturday(d));
      const extractionDate = date.getDate();
      return extractionDate;
    }
  }
}

// Traduce i giorni di estrazione da inglese a italiano
export function translateExtractionDay(extrDay) {
  if (extrDay === "Oggi") return [{ italianDay: "Oggi" }];
  return BILING_EXTRACTION_DAYS.filter((obj) => obj.englishDay === extrDay);
}
