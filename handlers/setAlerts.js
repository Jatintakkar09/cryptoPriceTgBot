import currencyPrice from "../Utils/currencyPrice.js"

const Intervals=new Map()

async function setAlerts(time,currency){
  setInterval(()=>{
   try {
    const price=await currencyPrice
   } catch (error) {
    
   }



  },1000*60*time)


}