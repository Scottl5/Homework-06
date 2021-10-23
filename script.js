const dayForecast = $("#day-forecast");
const city = $("#city-name");
const temp = $("#temperature");
const wind = $("#wind");
const humidity = $("#humidity");
const uvPara = $("#uv");
const uvSpan = $("#uv-span");
const searchBtn = $("#search");
const fiveDayHeader = $("#five-day-forecast");
let currentPic = $("#current-pic");
let cityName = $("#city-search");
let fiveDay = $(".five-day-el");
let weatherEl = $("#weather-element");
let cityEl = $("#city-history");
const cityArray = [];

searchBtn.on("click", function (event) {
  event.preventDefault();
  const cityInput = cityName.val().toLowerCase();
  cityArray.push(cityInput);
  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&units=imperial" +
    "&appid=3b796ec7f5ec9e41020b764aaaffa246";

  getData(url, cityInput);
  cityHistory(cityInput);
});

function getData(url, cityInput) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let cityTemp = data.main.temp;
      let windSpeed = data.wind.speed;
      let humidityDay = data.main.humidity;
      let currentPic = data.weather[0].icon;
      let picUrl =
        "https://openweathermap.org/img/wn/" + currentPic + "@2x.png";
      let currentDate = data.dt + data.timezone;
      let unixFormat = moment.unix(currentDate).format("MM/D/YYYY");
      weatherEl.removeClass("hidden");
      fiveDayHeader.removeClass("hidden");
      city.text(cityInput + " (" + unixFormat + ")");
      $("#current-pic").attr("src", picUrl);
      temp.text("Temp: " + cityTemp + "℉");
      wind.text("Wind: " + windSpeed + " MPH");
      humidity.text("Humidity: " + humidityDay + "%");
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      const weatherURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial" +
        "&exclude=alerts,hourly,minutely&appid=3b796ec7f5ec9e41020b764aaaffa246";
      getForecastData(weatherURL);
    });
}

function getForecastData(url) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      getFiveDay(data);
      let uvIndex = data.current.uvi;
      uvPara.removeClass("hidden");
      uvSpan.text(uvIndex);
      if (uvIndex <= 3) {
        uvSpan.css({
          background: "green",
          color: "white",
          padding: "5px",
        });
        uvSpan.css("border-radius", "5px");
      } else if (uvIndex >= 4 || uvIndex <= 7) {
        uvSpan.css({
          background: "yellow",
          color: "black",
          padding: "5px",
        });
        uvSpan.css("border-radius", "5px");
      } else {
        uvSpan.css({
          background: "red",
          color: "white",
          padding: "5px",
        });
        uvSpan.css("border-radius", "5px");
      }
    });
}
function getFiveDay(data) {
  fiveDay.empty();
  for (let i = 1; i < 6; i++) {
    let date = data.daily[i].dt + data.timezone_offset;
    let unixFormat = moment.unix(date).format("MM/D/YYYY");
    let fiveDayEl = $("<div>").addClass("col five-day");
    let fiveDayDate = $("<h5>").text(unixFormat);
    let currentPic = data.daily[i].weather[0].icon;
    let picUrl = "https://openweathermap.org/img/wn/" + currentPic + "@2x.png";
    let fiveDayPic = $("<img>");
    fiveDayPic.attr("src", picUrl);
    let fiveDayTemp = $("<p>").text("Temp: " + data.daily[i].temp.max + "℉");
    let fivedayWind = $("<p>").text(
      "Wind " + data.daily[i].wind_speed + " MPH"
    );
    let fiveDayHumidity = $("<p>").text(
      "Humidity: " + data.daily[i].humidity + "%"
    );
    fiveDayEl.append(fiveDayDate);
    fiveDayEl.append(fiveDayPic);
    fiveDayEl.append(fiveDayTemp);
    fiveDayEl.append(fivedayWind);
    fiveDayEl.append(fiveDayHumidity);
    fiveDay.append(fiveDayEl);
  }
}

function cityHistory() {
  cityEl.empty();
  for (let i = 0; i < cityArray.length; i++) {
    let cities = $("<button>").text(cityArray[i]);
    cities.addClass("col-12 city-buttons city-capital");
    cityEl.append(cities);
    cities.on("click", function (event) {
      let cityBtn = cityArray[i];
      let url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityBtn +
        "&units=imperial" +
        "&appid=3b796ec7f5ec9e41020b764aaaffa246";
      getData(url, cityBtn);
    });
  }
}
