async function currencyPrice(crypto){
    const url=`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
try {
    const data = await fetch(url, {
      cache: 'no-store', 
    });
    if(!data) throw new Error("Data Not Found");
    const json=await data.json()
    return json;
} catch (err) {
    console.error(err.message)
    throw err;
}

}
export default currencyPrice;