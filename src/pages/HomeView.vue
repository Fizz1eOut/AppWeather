<script>
import AppContainer from '@/components/Base/AppContainer.vue';
import { API_KEY, BASE_URL } from '@/assets/api/script';
import { defineComponent } from 'vue';
import WeatherSummary from '@/components/Content/WeatherSummary.vue';
import HighLights from '@/components/Content/HighLights.vue';
import TheCoordinates from '@/components/Content/TheCoordinates.vue';
import TheHumidity from '@/components/Content/TheHumidity.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    AppContainer,
    WeatherSummary,
    HighLights,
    TheCoordinates,
    TheHumidity
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
    <app-container size="xl">
      <div class="weather-content">
        <weather-summary 
          v-model="city"
          :weather-info="weatherInfo" 
          @get-weather="getWeather"
        />
        <high-lights :weather-info="weatherInfo" />
      </div>

      <div class="weather-bottom">
        <the-coordinates :weather-info="weatherInfo" />
        <the-humidity :weather-info="weatherInfo" />
      </div>
    </app-container>
  </div>
</template>

<style scoped>
  .weather {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .weather-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
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
  .weather-bottom {
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  @media (max-width: 1164px) {
    .weather-content {
      flex-direction: column;
      align-items: center;
    }
    .weather-bottom {
      flex-direction: column;
    }
  }
</style>