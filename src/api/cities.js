import { fetchData } from '@/modules/http';
import { capitalizeFirstLetter } from '@/untils/utils.js';

// Получение данных о городах
export const fetchCitiesData = async (cityName) => {
  const url = `${import.meta.env.VITE_GEOCODING_URL}?q=${cityName}&limit=5&appid=${import.meta.env.VITE_API_KEY}`;
  console.log(url);
  
  try {
    const data = await fetchData(url);

    // Обработка данных внутри функции
    const cities = data.map(item => ({
      name: capitalizeFirstLetter(item.name)
    })).filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name
      ))
    );

    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};