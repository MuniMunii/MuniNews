import useFetch from "../../hook/useFetch";
import LoadingComp from "../loadingComp";
function WeatherStatus(){
    const { value: Weather, isLoading: isLoadingWeather } = useFetch(
        `/other/weather-current`,
        (data) => ({
          country: data.weatherData.map((data: any) => {
            return {
              country: data.weather.location.name,
              cel: data.weather.current.temp_c,
              condition: data.weather.current.condition.icon,
            };
          }),
        }),"GET"
      );
    return isLoadingWeather ? (
        <div className="w-1/4 ml-auto flex justify-center border-l border-l-gray-600">
          <LoadingComp error={null} />
        </div>
      ) : (
        <div className="w-1/4 h-full border-l border-l-gray-600 ml-auto flex flex-col justify-start gap-4 p-3 font-Poppins">
          <p className="text-center text-blue-700 text-2xl font-semibold font-Poppins tracking-widest uppercase border-b-2 border-b-hotOrange dark:border-b-pastelTosca dark:text-white">
            Weather
          </p>
          {Weather?.country.map((country: any, index: number) => (
            <div key={`${country.country}-weather`} className="w-full flex justify-between items-center font-semiBold gap-2">
              <div className={`border-b ${
                    Math.floor(country.cel) > 20
                      ? " border-b-pink-500"
                      : " border-b-blue-500"
                  }`}>
                <p className="font-semibold">{country.country}</p>
                <p
                  className={`${
                    Math.floor(country.cel) > 20
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {country.cel}°
                </p>
              </div>
              <img src={country.condition} width={64} height={64} alt={country.condition} />
            </div>
          ))}
        </div>
      )
}
export default WeatherStatus;