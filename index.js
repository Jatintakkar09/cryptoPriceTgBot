import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import currencyPrice from "./Utils/currencyPrice.js";
import alert from "./handlers/setAlerts.js";
dotenv.config();
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `🚀 Track ETH, SOL & BTC live 📈 with awdfwelerts 🔔, trends 📊 — use
     /prices to begin!
     /setAlerts to set Alerts
     /deleteAlerts for deleting alerts
     `
  );
});

bot.onText(/\/prices/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "💰 Get ETH Price", callback_data: "get_ethereum" },
          { text: "💰 Get SOL Price", callback_data: "get_solana" },
        ],
        [
          { text: "💰 Get BTC Price", callback_data: "get_bitcoin" },
          { text: "💰 Get BSC Price", callback_data: "get_binancecoin" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Choose an option:", options);
});

// on Set alerts

bot.onText(/\/setAlerts/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ETH", callback_data: "set_ethereum" },
          { text: "SOL", callback_data: "set_solana" },
        ],
        [
          { text: "BTC", callback_data: "set_bitcoin" },
          { text: "BSC", callback_data: "set_binancecoin" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "💰 Choose Crypto 💰", options);
});


bot.onText(/\/deleteAlert/,(msg)=>{
  const chatId=msg.chat.id;
 const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ETH", callback_data: "del_ethereum" },
          { text: "SOL", callback_data: "del_solana" },
        ],
        [
          { text: "BTC", callback_data: "del_bitcoin" },
          { text: "BSC", callback_data: "del_binancecoin" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId,`💰Select Crypto💰`,options)



})


bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith("get_")) {
    const currency = data.split("_")[1];
    const price = await currencyPrice(currency);
    bot.sendMessage(chatId, `💰${currency} $${price[currency].usd}`);
  }

  if (data.startsWith("set_")) {
    const currency=data.split("_")[1]
    const options = {
      reply_markup: {
        inline_keyboard:[ [
          { text: "⏱ 5 mins", callback_data: `time_${currency}_5` },
          { text: "⏱ 10 mins", callback_data: `time_${currency}_10` },
        ],
        [
          { text: "⏱ 15 mins", callback_data: `time_${currency}_15` },
          { text: "⏱ 30  mins", callback_data: `time_${currency}_30` },
        ],[
          { text: "⏱ 1 hr", callback_data: `time_${currency}_60` },
          { text: "⏱ 1 Day", callback_data: `time_${currency}_1440` },
        ]]
      }
    };
    bot.sendMessage(chatId,`Choose time interval for ${currency}`,options)
  }


  if (data.startsWith("time_")){
   const currency=data.split("_")[1];
   const time=data.split("_")[2];
   console.log(currency, time)
   alert.setAlert(time,currency,bot,chatId)
  }

  if(data.startsWith("del_")){
    const currency=data.split("_")[1];
    alert.deleteAlerts(chatId,currency,bot)
  }


  bot.answerCallbackQuery(callbackQuery.id);
});
