import { fetchData } from '@/untils/utils.js';

// Получение данных о городах
export const fetchCitiesData = (cityName) => {
  const url = `${import.meta.env.VITE_GEOCODING_URL}?q=${cityName}&limit=5&appid=${import.meta.env.VITE_API_KEY}`;
  console.log(url)
  return fetchData(url);
};