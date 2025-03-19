// Clés et URL de l'API météo
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
    errorMessage.style.animation = null;
}

function setWeatherIcon(weatherMain) {
    const iconMap = {
        "Clouds": "images/clouds.png",
        "Clear": "images/clear.png",
        "Rain": "images/rain.png",
        "Drizzle": "images/drizzle.png",
        "Mist": "images/mist.png",
        "Snow": "images/snow.png",
    };
    weatherIcon.src = iconMap[weatherMain] || "images/default.png";
}

async function checkWeather(city) {
    try {
        const response = await fetch(apiURL + city + `&appid=${apiKey}`);
        if (!response.ok) {
            errorMessage.textContent = "Ville non trouvée ou erreur de réseau.";
            errorMessage.style.display = "block";
            weather.style.display = "none";
            triggerErrorAnimation();
            return;
        }
        const data = await response.json();

        errorMessage.style.display = "none";
        weather.style.display = "block";

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";
        document.querySelector(".local-time").textContent = "Heure locale : " + updateLocalTime(data.timezone);

        setWeatherIcon(data.weather[0].main);
    } catch (error) {
        console.error("Erreur lors de la récupération des données météo:", error);
        errorMessage.textContent = "Erreur lors de la récupération des données météo.";
        errorMessage.style.display = "block";
        weather.style.display = "none";
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
        weather.style.display = "none";
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
            weather.style.display = "none";
            triggerErrorAnimation();
        }
    }
});
