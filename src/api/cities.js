import { fetchData } from '@/api/utils';

// Получение данных о городах
export const fetchCitiesData = () => {
  const url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
  return fetchData(url);
};