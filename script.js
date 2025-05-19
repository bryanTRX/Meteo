const apiKey = "53000ec71c69bf4a1498fdb03c7d5b5e";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorMessage = document.querySelector(".error");
const weather = document.querySelector(".weather");

function updateLocalTime(timezoneOffset) {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + timezoneOffset * 1000);
  return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function triggerErrorAnimation() {
  errorMessage.style.animation = 'none';
  void errorMessage.offsetWidth;
  errorMessage.style.animation = 'shake 0.5s';
}

function setWeatherIcon(weatherMain) {
  const iconMap = {
    "Clouds": "images/clouds.png",
    "Clear": "images/clear.png",
    "Rain": "images/rain.png",
    "Drizzle": "images/drizzle.png",
    "Mist": "images/mist.png",
    "Snow": "images/snow.png"
  };
  weatherIcon.src = iconMap[weatherMain];
}

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiURL}${encodeURIComponent(city)}&appid=${apiKey}`);
    if (!response.ok) {
      errorMessage.textContent = "Ville non trouvée ou erreur de réseau.";
      errorMessage.style.display = "block";
      weather.classList.remove("show");
      triggerErrorAnimation();
      return;
    }

    const data = await response.json();
    console.log(data); 

    errorMessage.style.display = "none";
    weather.classList.add("show");

    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " Km/h";
    document.querySelector(".local-time").textContent = "Heure locale : " + updateLocalTime(data.timezone);

    setWeatherIcon(data.weather[0].main);
  } catch (error) {
    console.error("Erreur API:", error);
    errorMessage.textContent = "Erreur lors de la récupération des données météo.";
    errorMessage.style.display = "block";
    weather.classList.remove("show");
    triggerErrorAnimation();
  }
}

function validateInput(input) {
  return input.trim() !== "";
}

searchButton.addEventListener("click", () => {
  if (validateInput(searchBox.value)) {
    checkWeather(searchBox.value.trim());
  } else {
    errorMessage.textContent = "Veuillez entrer le nom d'une ville.";
    errorMessage.style.display = "block";
    weather.classList.remove("show");
    triggerErrorAnimation();
  }
});

searchBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (validateInput(searchBox.value)) {
      checkWeather(searchBox.value.trim());
    } else {
      errorMessage.textContent = "Veuillez entrer le nom d'une ville.";
      errorMessage.style.display = "block";
      weather.classList.remove("show");
      triggerErrorAnimation();
    }
  }
});
