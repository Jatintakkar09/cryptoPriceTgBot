import currencyPrice from "../Utils/currencyPrice.js";

const Intervals = new Map();

function setAlert(time, currency, bot, chatId) {
  const key = `${chatId}_${currency.toLowerCase()}`;

  if (Intervals.has(key)) {
    clearInterval(Intervals.get(key));
    Intervals.delete(key);
    bot.sendMessage(chatId, `♻️ Updating alert for ${currency.toUpperCase()}...`);
  }

  const intervalId = setInterval(async () => {
    try {
      const price = await currencyPrice(currency);
      const coinData = price[currency.toLowerCase()];
      const usdPrice = coinData?.usd;

      if (usdPrice) {
        bot.sendMessage(chatId, `📈 ${currency.toUpperCase()} Price: $${usdPrice}`);
      } else {
        bot.sendMessage(chatId, `⚠️ Could not fetch price for ${currency.toUpperCase()}`);
      }

    } catch (err) {
      bot.sendMessage(chatId, `❌ Failed to fetch price for ${currency.toUpperCase()}`);
    }
  }, 1000 * 60 * time);

  Intervals.set(key, intervalId);
  bot.sendMessage(chatId, `✅ Alert set for ${currency.toUpperCase()} every ${time} minute(s).`);
}

function deleteAlerts(chatId, currency, bot) {
  const key = `${chatId}_${currency.toLowerCase()}`;

  if (Intervals.has(key)) {
    clearInterval(Intervals.get(key));
    Intervals.delete(key);
    bot.sendMessage(chatId, `🛑 Alert for ${currency.toUpperCase()} has been stopped.`);
  } else {
    bot.sendMessage(chatId, `⚠️ Alert for ${currency.toUpperCase()} does not exist.`);
  }
}

export default { Intervals, setAlert, deleteAlerts };
