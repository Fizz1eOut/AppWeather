<script>
import { API_KEY, BASE_URL } from '@/assets/api/script';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',

  components: {

  },

  data() {
    return {
      city: 'New York',
      weatherInfo: null
    };
  },

  mounted() {
    this.getWeather();
  },

  methods: {
    async getWeather() {
      try {
        const response = await fetch(`${BASE_URL}?q=${this.city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        this.weatherInfo = data;
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    },

    getWeatherIcon(description) {
      // Заменяем пробелы на %20
      const formattedDescription = description.replace(/ /g, '%20');
      // Формируем путь к изображению на основе данных
      return `src/assets/img/background/${formattedDescription}.png`;
    }
  }
});
</script>

<template>
  <div class="weather">
    <div v-if="weatherInfo" class="weather-background">
      <img :src="getWeatherIcon(weatherInfo.weather[0].description)" alt="Icon" class="background-image">
    </div>
  </div>
</template>

<style scoped>
  .weather {
  position: relative;
  width: 100%;
  height: 100%;
}

.weather-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>