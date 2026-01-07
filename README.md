<h1 style="text-align:center;">SuperEnaBot</h1>

SuperEnaBot è una piccola single page application fullstack con backend (Node.js e Express) e frontend (React + Vite) in un'unica soluzione.
È un'applicazione per generare i sei numeri + numero SuperStar da giocare alla prossima estrazione del SuperEnalotto che utilizza un algoritmo molto semplice pe calcolarli in base ai numeri più frequenti e ai ritardatari.
I numeri vengono ottenuti tramite scraping con Puppeteer da due specfici siti web. Una volta ottenuti vengono scritti in un file json e inviati al frontend al mount del componente React nella pagina.
I numeri possono anche essere inviati con un bot Telegram al click di un button dell'utente o direttamente con un comando dall'app Telegram senza passare dal frontend.
<br>

<p align="center">
  <img src="./SuperEnaBot.webp" alt="Screenshot App" width="700" />
</p>

---

## 🔁 Flusso semplificato

- Server e Client vengono avviati in simultanea con la libreria concurrently.

### Backend

- Il server chiama la funzione asincrona che contiene le operazioni di Pupeteer e che si occupa di fare lo scraping dei sei numeri dell'ultima estrazione da uno specifico sito X e del numero SuperStar più frequente da un secondo specifico sito Y.
- Una volta ottenuti i dati, viene applicato l'algoritmo e il relativo output viene scritto in un file json.
- Ogni X minuti/ore/giorni (modificabile in base alle esigenze) viene rieffettuato lo scraping dei dati, che vengono comparati ai dati salvati in precedenza e in base all'esito della comparazione vengono sovrascritti nel file json.

### Frontend

- Al mount del componente uno useEffect di React effettua una fetch asincrono all'endpoint
  gestito da Express nel backend.
- Express risponde alla richiesta get con i sei numeri da giocare e il numero SuperStar che vengono quindi renderizzati nella pagina.
- Nel frontend è anche presente un button per inviare i numeri a uno specifico chatId/channelId di Telegram grazie a una funzione asincrona che viene chiamata al click del button e che effettua una richiesta post, sempre gestita da Express.
- Express riceve la richiesta e chiama la funzione di invio messaggio del bot grazie a Telegraf e risponde al client con lo status della richiesta.

---

### Bot Telegram

Il bot Telegram e il frontend sono completamente indipendenti:
grazie a Telegraf il bot può anche inviare i dati in risposta a un comando direttamente dall'app di Telegram, senza dover mai passare dal frontend come un qualsiasi altro bot.

---

## Altre features

- Funzioni di scraping che vengono ripetute fino a un massimo di 5 volte con intervalli random variabili e ad aumenti esponenziali in caso di fallimento o dati parziali;
- Manipolazione dei parametri di Puppeteer con user-agents e altri accorgimenti per ridurre le probabilità di essere bloccati dai siti target;
- Rendering condizionale con React in base allo stato delle richieste asincrone e in caso di dati non disponibili;
- Loading spinner durante le richieste asincrone;
- Previsione di giorno e data della prossima estrazione.

---

## ⚠️ Attenzione

Questa piccola applicazione è un proof of concept sviluppato **a scopo dimostrativo e didattico**.  
Nella repo non metterò gli url dei due siti target dello scraper e anche se mi sono assicurato che lo scraper non sovraccarichi in alcun modo i siti, preferisco comunque evitare e **non sono responsabile per qualsiasi utilizzo inappropriato**.

---

## Tecnologie usate

<table>
<tr>
<td valign="top">

### Backend

- Node.js
- Express
- Puppeteer
- Telegraf
- cuncurrently
- user-agents

</td>
<td valign="top">

### Frontend

- React
- Vite
- Tailwindcss
- Date-fns

</td>
</tr>
</table>
