import currencyPrice from "../Utils/currencyPrice.js"


const Intervals=new Map()

function setAlerts(time, currency, bot, chatId) {
  const key = `${chatId}_${currency.toLowerCase()}`;

  // If an alert already exists → clear it
  if (Intervals.has(key)) {
    clearInterval(Intervals.get(key));
    Intervals.delete(key);
    bot.sendMessage(chatId, `♻️ Updating alert for ${currency.toUpperCase()}...`);
  }

  const intervalId = setInterval(async () => {
    try {
      const price = await currencyPrice(currency);
      bot.sendMessage(chatId, `📈 ${currency.toUpperCase()} Price: $${price}`);
    } catch (err) {
      bot.sendMessage(chatId, `❌ Failed to fetch price for ${currency.toUpperCase()}`);
    }
  }, 1000 * 60 * time);

  Intervals.set(key, intervalId);
  bot.sendMessage(chatId, `✅ Alert set for ${currency.toUpperCase()} every ${time} minute(s).`);
}


function deleteIntervals(chatId,currency){
const key=`${chatId}_${currency.toLowerCase()}`

}