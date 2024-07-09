

const cityInput=document.querySelector('div.search input');
const searchButton=document.querySelector('.search-icon');
const otherDaysDiv = document.querySelector('.weekly-updates');

const currentDayDiv = document.querySelector('.current-day.active.panels');

const MainWeather= document.querySelector('.main-weather');

const API_KEY = "5da2bfa728d872a7bfdbe358f7902fa9";

const createWeatherCard = (weatherItem, index)=>{

    if(index===0){
        return ` <div class="items">
                    <div class="day">(${weatherItem.dt_txt.split(" ")[0]})</div>

                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
    
                    <div class="temp">Temp - ${(weatherItem.main.temp - 273.15).toFixed(2)}°C </div>
    
                    <div class="temp"> Humidity - ${weatherItem.main.humidity}% </div>
                </div>`;
    }else{return ` 
        <div class="Other-days panels">
       <div class="items">
               <div class="day">(${weatherItem.dt_txt.split(" ")[0]})</div>

               <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">

               <div class="temp">Temp - ${(weatherItem.main.temp - 273.15).toFixed(2)}°C </div>

               <div class="temp"> Humidity - ${weatherItem.main.humidity}% </div>
           </div>
           </div>`;}
    
}



const getWeatherDetails = ( CityName ,lat, lon)=>{
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  

    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then((data) =>{

        

        //filter forecasts per day

        const UniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!UniqueForecastDays.includes(forecastDate)){
                return UniqueForecastDays.push(forecastDate);
            }
        });

        // cityInput.value="";  
        // otherDaysDiv.innerHTML="";
        const otherDaysPanels = document.querySelectorAll('.Other-days.panels');
            otherDaysPanels.forEach(panel => panel.remove());

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem,index) => {

            if(index===0){
            currentDayDiv.innerHTML = createWeatherCard(weatherItem,index);

            MainWeather.innerHTML = `<div class="wrapper"> <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
            </div>
            <div class="location-name">
                ${cityInput.value}
            </div>
            <div class="temp">
             <img src="/images/thermometer.png" alt="">
                ${(weatherItem.main.temp - 273.15).toFixed(2)}°C 
            </div>
            <div class="other-updates">
                <div class="humidity">
                 <img src="/images/humidity.png" alt="">
                    Humidity:${weatherItem.main.humidity}%
                </div>
                <div class="pressure">
                 <img src="/images/gauge.png" alt="">
                    pressure:${weatherItem.main.pressure}
                </div>
                <div class="wind-speed">
                 <img src="/images/wind.png" alt="">
                    wind speed:${weatherItem.wind.speed}
                </div>
                </div>`;
            }
            else{
                otherDaysDiv.insertAdjacentHTML("beforeend",createWeatherCard(weatherItem,index));

            }
            addClickEventToPanels();
           
        });


    }).catch(()=>{
        alert("An error occured while fetching the weather forecast");
    });
}

const getCityCoordinates= ()=>{
    const CityName=cityInput.value.trim();

    if(!CityName){
        return;
    }

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
    .then(res => res.json())
    .then((data)=>{
        if(!data.length)return alert(`No coordinates found for ${CityName}`);
        const{ name, lat ,lon }=data[0];
        getWeatherDetails( name, lat, lon);
    }).catch(()=>{
        alert("An error occured while fetching the coordinates");
    });
}

searchButton.addEventListener("click",getCityCoordinates);





// const panels=document.querySelectorAll('.panels');
// panels.forEach(panel=>{
//     panel.addEventListener('click',()=>{
//         removeActiveClasses();
//         panel.classList.add('active');
//     })
// })

// function removeActiveClasses(){
//     panels.forEach(panel=>{
//         panel.classList.remove('active');
//     })
// }


const addClickEventToPanels = () => {
    const panels = document.querySelectorAll('.panels');
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            removeActiveClasses();
            panel.classList.add('active');
        });
    });
};

const removeActiveClasses = () => {
    const panels = document.querySelectorAll('.panels');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
};

addClickEventToPanels();