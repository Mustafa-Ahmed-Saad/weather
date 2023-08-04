const searchBtn = document.getElementById("submit");
const searchInput = document.getElementById("search-input");
const cityNameDiv = document.getElementById("city-name");
const day1Name = document.getElementById("day1-name");
const d1Month1Name = document.getElementById("d1-month1-name");
const d1Condition = document.getElementById("d1-condition");
const d1ImgIcon = document.getElementById("d1-img-icon");
const windSpeed = document.getElementById("wind-speed");
const windDir = document.getElementById("wind-dir");
const humidityEl = document.getElementById("humidity");
const temperatureDiv = document.getElementById("temperature");

var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const API_WEATHER_KEY = "75ca1647d2df4d3f8ab181551230308";

searchBtn.addEventListener("click", weather);
searchInput.addEventListener("input", weather);

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();

// ----------------------------------------------------------------------

function weather(e) {
  e.preventDefault();
  getWeather(searchInput.value);
}

// async function getWeather(city) {
async function getWeather(position) {
  if (position.coords) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_WEATHER_KEY}&q=${lat},${lng}&days=3&aqi=no&alerts=no`,
      { method: "GET" }
    );
    const result = await response.json();

    if ((await result.location) && (await result.forecast)) {
      displayDay1(result);
      displayOtherDays(result);
    } else {
      console.log("err");
    }
  } else {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_WEATHER_KEY}&q=${position}&days=3&aqi=no&alerts=no`,
      { method: "GET" }
    );
    const result = await response.json();

    if ((await result.location) && (await result.forecast)) {
      displayDay1(result);
      displayOtherDays(result);
    } else {
      console.log("err");
    }
  }
}

function displayDay1(result) {
  console.log(result);
  var d1 = getDayName(result.forecast.forecastday[0].date);
  var m1 = getMonthName(result.forecast.forecastday[0].date);
  day1Name.innerText = d1;
  d1Month1Name.innerText =
    new Date(result.forecast.forecastday[0].date).getDay() - 1 + m1;
  cityNameDiv.innerText = result.location.name;
  temperatureDiv.innerHTML = `${result.forecast.forecastday[0].day.avgtemp_c}<sup>o</sup>C`;
  d1Condition.innerText = result.current.condition.text;
  d1ImgIcon.src = result.current.condition.icon;
  windSpeed.innerText = result.current.wind_kph + "km/h";
  windDir.innerText = result.current.wind_dir;
  humidityEl.innerText = result.current.humidity;
}

function displayOtherDays(result) {
  // handel day2 and day3
  let El;
  for (let i = 1; i < result.forecast.forecastday.length; i++) {
    console.log(i);
    // El = document.querySelector(`#dayIndex${i}`);
    El = document.getElementById(`dayIndex${i}`);
    El.querySelector(".simi-dark").innerText = getDayName(
      result.forecast.forecastday[i].date
    );

    El.querySelector("img").src =
      result.forecast.forecastday[i].day.condition.icon;
    El.querySelector(
      "small"
    ).innerHTML = `${result.forecast.forecastday[i].day.mintemp_c}<sup>o</sup>`;
    El.querySelector(
      ".temp"
    ).innerHTML = `${result.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C`;
    El.querySelector(".sunny").innerText =
      result.forecast.forecastday[i].day.condition.text;
  }
}

function getDayName(date) {
  var d = new Date(date);
  return days[d.getDay()];
}

function getMonthName(date) {
  const m = new Date(date);
  return monthNames[m.getMonth()];
}

// if you want get location name or name of city using long and lat
// const fetchLocationName = async (position) => {
//   const lat = position.coords.latitude;
//   const lng = position.coords.longitude;

//   const API_MAPQUEST_KEY = "6j85p2BZ4uOqNdEgYukLHSFc84riBPmR";
//   const response = await fetch(
//     `https://www.mapquestapi.com/geocoding/v1/reverse?key=${API_MAPQUEST_KEY}&location=` +
//       lat +
//       "%2C" +
//       lng +
//       "&outFormat=json&thumbMaps=false"
//   );

//   const result = await response.json();
//   console.log("locationName", result.results[0].locations[0].adminArea5);
// };
