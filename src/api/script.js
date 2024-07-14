const API_KEY = '72ed65fc48109f08f367ef8df5d7e021';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Функция для обработки ответа от API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} ${response.statusText}\n${errorText}`);
  }
  return response.json();
};

// Общая функция для выполнения запросов
const fetchData = async (url) => {
  const response = await fetch(url);
  return handleResponse(response);
};

// Получение данных о погоде по названию города
export const getWeatherData = (city) => {
  const url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
  return fetchData(url);
};

// Получение прогнозов погоды по координатам
export const getForecastData = (lat, lon) => {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return fetchData(url);
};

// Получение данных о погоде по геолокации
export const getGeoLocationWeather = (lat, lon) => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  return fetchData(url);
};

// Получение данных о городах
export const fetchCitiesData = () => {
  const url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
  return fetchData(url);
};