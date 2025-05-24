//CONFIGURATION
const API_KEY = '7ec2d0652cd848c7b4e181822252405';
const DEFAULT_LOCATION = 'London';

//DOM ELEMENTS
const themeToggle = document.getElementById('themeToggle');
const unitToggle = document.getElementById('unitToggle');
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.querySelector('.weather-card');
const body = document.body;

//STATE
let currentUnit = 'C';
let currentTempC = null;

//THEME TOGGLE
themeToggle.addEventListener('click', () => {
  body.classList.toggle('night');
  body.classList.toggle('day');

  const icon = themeToggle.querySelector('i');
  if (body.classList.contains('night')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
});


//UNIT TOGGLE
unitToggle.addEventListener('click', () => {
  if (currentTempC === null) return;
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  unitToggle.textContent = `°${currentUnit}`;
  updateTemperatureDisplay();
});

function updateTemperatureDisplay() {
  const tempElement = document.querySelector('.temperature');
  if (!tempElement) return;
  if (currentUnit === 'C') {
    tempElement.textContent = `${currentTempC}°C`;
  } else {
    const fTemp = Math.round(currentTempC * 9 / 5 + 32);
    tempElement.textContent = `${fTemp}°F`;
  }
}

//WEATHER FETCH FUNCTION
async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    alert('Could not load weather. Check your API key or connection.');
  }
}

//UPDATE UI
function updateWeatherUI(data) {
  const locationEl = document.querySelector('.location');
  const conditionEl = document.querySelector('.condition');

  locationEl.textContent = `${data.location.name}, ${data.location.country}`;
  conditionEl.textContent = data.current.condition.text;

  currentTempC = Math.round(data.current.temp_c);
  updateTemperatureDisplay(); // render temp in correct unit
}

//SEARCH FUNCTIONALITY
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = '';
  }
});

//INIT
fetchWeather(DEFAULT_LOCATION);
