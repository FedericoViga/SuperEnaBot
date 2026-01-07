import TelegramIcon from "./icons/TelegramIcon";

function TelegramButton({ onClick, onSending }) {
  return (
    <button
      onClick={onClick}
      className={`flex gap-3 justify-center items-center p-2 hover:cursor-pointer min-w-43.75 ${
        onSending ? "" : "border border-[#29aaec] rounded"
      }`}
      disabled={onSending}
    >
      <TelegramIcon />
      {onSending ? (
        <span>Invio in corso...</span>
      ) : (
        <span>Invia su Telegram</span>
      )}
    </button>
  );
}

export default TelegramButton;
