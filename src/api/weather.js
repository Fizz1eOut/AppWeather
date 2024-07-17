import { API_KEY, BASE_URL, FORECAST_URL } from '@/api/env';
import { fetchData } from '@/api/utils';

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