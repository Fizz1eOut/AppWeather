import { fetchData } from '@/modules/http';

// Получение данных о погоде по названию города
export const getWeatherData = (city) => {
  const url = `${import.meta.env.VITE_BASE_URL}?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
  return fetchData(url);
};

// Получение прогнозов погоды по координатам
export const getForecastData = (lat, lon) => {
  const url = `${import.meta.env.VITE_FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
  return fetchData(url);
};

// Получение данных о погоде по геолокации
export const getGeoLocationWeather = (lat, lon) => {
  const url = `${import.meta.env.VITE_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
  return fetchData(url);
};