<script>
import { defineComponent } from 'vue';
import WeatherDetails from '@/components/Content/WeatherDetails.vue';
import WeatherSearch from '@/components/Content/WeatherSearch.vue';
import { debounce } from '@/untils/utils.js';
import { getWeatherData, getForecastData, getGeoLocationWeather } from '@/api/weather';
import { fetchCitiesData } from '@/api/cities';

export default defineComponent({
  name: 'HomeView',

  components: {
    WeatherDetails,
    WeatherSearch
  },

  data() {
    return {
      weatherInfo: null,
      errorMessage: '',
      weatherImages: {},
      cities: [],
      selectedCityTime: null,
      forecast: [],
    };
  },

  computed: {
    city: {
      get() {
        return this.$route.query.city;
      },
      set(newValue) {
        const query = { ...this.$route.query, city: newValue === null ? undefined : newValue }
        this.$router.push({ query })
      }
    },
  },

  watch: {
    city() {
      if (this.city) {
        this.debouncedGetWeather();
      } else {
        this.weatherInfo = null;
        this.errorMessage = '';
      }
    }
  },

  created() {
    this.debouncedGetWeather = debounce(this.getWeather, 500);
    this.debouncedFetchCities = debounce(this.fetchCities, 300);
  },

  mounted() {
    if (this.city) {
      this.debouncedGetWeather();
    } else {
      this.getGeoLocation();
    }

    const imageFiles = import.meta.glob('../assets/img/background/*.png');
    for (const path in imageFiles) {
      imageFiles[path]().then((mod) => {
        // Извлекаем URL изображения из загруженного модуля
        const imageUrl = mod.default;
        // console.log(imageUrl);
        // Получаем имя файла из пути
        const fileName = path.split('/').pop().replace('.png', '');
        // console.log(fileName)
        // Добавляем изображение в объект weatherImages
        this.weatherImages[fileName] = imageUrl;
      });
    }

    // this.fetchCities();
  },

  methods: {
    async getWeather() {
      if (!this.city) return;
      try {
        const data = await getWeatherData(this.city);
        this.weatherInfo = data;
        this.errorMessage = '';

        this.selectedCityTime = new Date().getTime() / 1000 + data.timezone;

        await this.getForecast(data.coord.lat, data.coord.lon);
      } catch (error) {
        this.errorMessage = 'Failed to retrieve weather data. Please check if you entered the city correctly';
      }
    },

    async getForecast(lat, lon) {
      try {
        const data = await getForecastData(lat, lon);
        this.forecast = data.list;
      } catch (error) {
        console.error('Failed to retrieve forecast:', error);
      }
    },

    async getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          try {
            const data = await getGeoLocationWeather(latitude, longitude);
            this.weatherInfo = data;
            this.errorMessage = '';

            this.selectedCityTime = new Date().getTime() / 1000 + data.timezone;

            await this.getForecast(data.coord.lat, data.coord.lon);
          } catch (error) {
            this.errorMessage = 'Failed to retrieve weather data.';
          }
        });
      }
    },

    async fetchCities(cityName) {
      try {
        this.cities = await fetchCitiesData(cityName);
        console.log(this.cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    },

    updateCity(newCity) {
      this.city = newCity;
      this.debouncedGetWeather();
    },

    updateWeather() {
      if (!this.city) {
        this.$router.push({ path: '/', query: {} });
        return;
      }

      this.$router.push({ query: { city: this.city } });
      this.debouncedGetWeather();
    },

    getWeatherIcon(description) {
      return this.weatherImages[description];
    },
  }
});
</script>

<template>
  <weather-details
    v-if="weatherInfo"
    v-model="city"
    :weather-info="weatherInfo"
    :forecast="forecast"
    :city-time="selectedCityTime"
    :cities="cities"
    :error-message="errorMessage"
    @update-weather="debouncedGetWeather"
    @fetch-cities="debouncedFetchCities"
  />
  
  <weather-search
    v-else
    :model-value="city"
    :error-message="errorMessage"
    :cities="cities"
    @update:model-value="updateCity"
    @fetch-cities="debouncedFetchCities"
  />
</template>

<style scoped>
  .weather-container {
    width: 100%;
    height: 100vh;
    background-image: url(../assets/img/home.jpg);
    background-position: center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .weather-container__title {
    font-size: 42px;
    text-align: center;
    margin-bottom: 50px;
  }
  @media (max-width: 499px) {
    .weather-container__title {
      font-size: 32px;
    }
  }
  .weather-container__input .input {
    background-color: red;
  }
  .error-message {
    color: red;
  }
</style>