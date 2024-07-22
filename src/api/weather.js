const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const FORECAST_URL = import.meta.env.VITE_FORECAST_URL;
import { fetchData } from '@/untils/utils.js';

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