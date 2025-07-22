
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import currencyPrice from "./Utils/currencyPrice.js";
dotenv.config()
const token=process.env.TOKEN

const bot= new TelegramBot(token,{polling:true})

bot.onText(/\/start/,(msg)=>{
const chatId=msg.chat.id;
bot.sendMessage(chatId,"🚀 Track ETH, SOL & BTC live 📈 with alerts 🔔, trends 📊 — use /prices to begin!")
})

bot.onText(/\/prices/,(msg)=>{
const chatId=msg.chat.id;
 const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💰 Get ETH Price', callback_data: 'get_eth' },
          { text: '💰 Get SOL Price', callback_data: 'get_sol' }         
        ],
        [
           { text: '💰 Get BTC Price', callback_data: 'get_btc' },
           { text: '💰 Get BSC Price', callback_data: 'get_bsc' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, 'Choose an option:', options);

})

bot.on("callback_query",async(callbackQuery)=>{
const msg=callbackQuery.message;
const chatId=msg.chat.id;
const data=callbackQuery.data

if(data=="get_eth") {
const price=await currencyPrice("ethereum")
bot.sendMessage(chatId,`Eth $${price.ethereum.usd}`)
}

if(data=="get_sol"){
const price=await currencyPrice("solana");
bot.sendMessage(chatId,`Sol $${price.solana.usd}`)
}


if(data=="get_btc"){
const price=await currencyPrice("bitcoin");
bot.sendMessage(chatId,`Bitcoin $${price.bitcoin.usd}`)
}


if (data === "get_bsc") {
  const price = await currencyPrice("binancecoin");
  bot.sendMessage(chatId,`BSC  ${price.binancecoin.usd}`)
}



bot.answerCallbackQuery(callbackQuery.id)
})