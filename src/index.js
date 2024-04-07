function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = searchInputElement.value;
  fetchTemperature(searchInputElement.value);
}
function fetchTemperature(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=89a1t796bdcc9bd55a96fad43ae0a68o&units=metric`;

  axios
    .get(apiUrl)
    .then((response) => displayTemperature(response))
    .catch((error) => console.error("Error fetching temperature:", error));
}

function displayTemperature(response) {
  // Showcases the current temperature
  let temp = Math.round(response.data.temperature.current);
  let tempElement = document.querySelector("#current-temperature-value");
  tempElement.innerHTML = `${temp}`;

  // Showacases the current condition
  let description = response.data.condition.description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${description}`;

  // showcases the current humidity
  let humidity = `${response.data.temperature.humidity}%`;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}`;

  // showcases the current wind speed
  let wind = `${response.data.wind.speed}Km/h`;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${wind}`;

  // Live weather Icon
  let icon = ` <img src=" ${response.data.condition.icon_url}"  class="icon"   />`;
  let iconElement = document.querySelector("#icon");
  iconElement.innerHTML = `${icon}`;

  getForecast(response.data.city);

  console.log(response.data.temperature.current);
  console.log(response.data.condition.description);
  console.log(response.data.temperature.humidity);
  console.log(response.data.wind.speed);
  console.log(response.data.condition.icon_url);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateELement = document.querySelector("#current-date");
let currentDate = new Date();

currentDateELement.innerHTML = formatDate(currentDate);

// All days weather forecast

function getForecast(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=89a1t796bdcc9bd55a96fad43ae0a68o&units=metric`;
  axios(apiUrl).then(displayForecast);
}

// function formatDay(timestamp) {
//   let date = new Date(timestamp * 1000);
//   let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
//   return days[date.getDay()];
// }

function displayForecast(response) {
  let forecastHtml = "";

  // Check if response.data.daily exists and is an array
  if (response.data.daily && Array.isArray(response.data.daily)) {
    // Iterate over the first five days of the forecast data
    response.data.daily.slice(0, 6).forEach(function (day) {
      // Create a new Date object with the timestamp
      let date = new Date(day.time * 1000);
      // Get the day of the week (0-6)
      let dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

      forecastHtml += `<div class="weather-forecast-day">
          <div class="weather-forecast-date">${dayOfWeek}</div>
          <div class="weather-forecast-icon">
            <img src="${day.condition.icon_url}" />
          </div>
          <div class="weather-forecast-temperature">
            <strong><span>${Math.round(
              day.temperature.minimum
            )}°C  </span><span>${Math.round(
        day.temperature.maximum
      )}°C</span></strong>
          </div>
        </div>`;
    });
  } else {
    forecastHtml = "<div>No forecast data available</div>";
  }

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}
