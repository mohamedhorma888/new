// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main Search Handler
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    clearError();
    showLoading();
    hideWeather();

    try {
        // Get coordinates from city name
        const geoData = await getCoordinates(city);
        
        if (!geoData) {
            showError('City not found. Please try another search.');
            hideLoading();
            return;
        }

        // Fetch weather data using coordinates
        const weatherData = await getWeatherData(geoData);
        
        // Display weather data
        displayWeatherData(weatherData, geoData);
        showWeather();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Get Coordinates from City Name using Geocoding API
async function getCoordinates(cityName) {
    try {
        // Using Open-Meteo Geocoding API (free, no API key needed)
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country,
            country_code: result.country_code,
            admin1: result.admin1 || ''
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

// Fetch Weather Data
async function getWeatherData(geoData) {
    try {
        // Using Open-Meteo Weather API (free, no API key needed)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,weather_code,visibility,uv_index&timezone=auto`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        
        return {
            current: data.current,
            timezone: data.timezone,
            geoData: geoData
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Get Weather Description from WMO Code
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
}

// Get Weather Icon from WMO Code
function getWeatherIcon(code) {
    // OpenWeatherMap icons (compatible URLs)
    const baseUrl = 'https://openweathermap.org/img/wn';
    
    if (code === 0) return `${baseUrl}/01d@4x.png`; // Clear sky
    if (code === 1 || code === 2) return `${baseUrl}/02d@4x.png`; // Partly cloudy
    if (code === 3) return `${baseUrl}/04d@4x.png`; // Overcast
    if (code === 45 || code === 48) return `${baseUrl}/50d@4x.png`; // Fog
    if (code >= 51 && code <= 67) return `${baseUrl}/09d@4x.png`; // Rain
    if (code >= 71 && code <= 86) return `${baseUrl}/13d@4x.png`; // Snow
    if (code >= 80 && code <= 82) return `${baseUrl}/10d@4x.png`; // Rain showers
    if (code >= 85 && code <= 86) return `${baseUrl}/13d@4x.png`; // Snow showers
    if (code >= 95 && code <= 99) return `${baseUrl}/11d@4x.png`; // Thunderstorm
    
    return `${baseUrl}/01d@4x.png`; // Default
}

// Display Weather Data
function displayWeatherData(data, geoData) {
    const current = data.current;

    // Location Info
    document.getElementById('cityName').textContent = geoData.name;
    document.getElementById('countryCode').textContent = `${geoData.country} (${geoData.country_code})`;

    // Main Weather Info
    document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('description').textContent = getWeatherDescription(current.weather_code);
    document.getElementById('weatherIcon').src = getWeatherIcon(current.weather_code);

    // Weather Details
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('visibility').textContent = `${Math.round(current.visibility / 1000)} km`;
    document.getElementById('uvIndex').textContent = `${current.uv_index.toFixed(1)}`;

    // Note: Sunrise and Sunset would require daily forecast API
    // For now, we'll show a placeholder or fetch from daily API
    document.getElementById('sunrise').textContent = 'N/A';
    document.getElementById('sunset').textContent = 'N/A';
}

// UI Functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showWeather() {
    weatherContainer.classList.remove('hidden');
}

function hideWeather() {
    weatherContainer.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Optional: Auto-load weather for a default city on page load
window.addEventListener('DOMContentLoaded', () => {
    // Optionally load weather for a default city
    // Uncomment the line below to auto-load
    // cityInput.value = 'London';
    // handleSearch();
});
