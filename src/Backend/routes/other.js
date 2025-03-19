const express=require('express')
const router=express.Router();
const axios=require('axios');
router.get('/weather-current',async (req,res)=>{
    try{
    const baseURLWeatherApi='http://api.weatherapi.com/v1/current.json'
    const apiKey=process.env.API_KEY_WEATHER
    const cities=['Jakarta','kuala lumpur','tokyo','singapore','dubai','new york','seoul','berlin','london','paris','vienna']
    const cityRequest=cities.map((city)=>{return axios.get(`${baseURLWeatherApi}?key=${apiKey}&q=${city}`)})
    const response=await Promise.all(cityRequest)
    const weatherData=response.map((res,index)=>({
        city:cities[index],
        weather:res.data,
    }))
    res.status(200).json({weatherData,messages:'success'})
}catch(error){return res.status(403).json({messages:`weather api error: ${error.response?.data || error.message}`})}
})
module.exports=router;