<script>
import { defineComponent } from 'vue';
import WeatherDetails from '@/components/Content/WeatherDetails.vue';
import WeatherSearch from '@/components/Content/WeatherSearch.vue';
// import debounce from 'lodash/debounce';
import { getWeatherData, getForecastData, getGeoLocationWeather, fetchCitiesData } from '@/api/script';

function debounce(func, wait) {
  // Переменная для хранения идентификатора таймера
  let timeout;
  
  // Возвращаемая функция, которая будет вызываться вместо оригинальной
  return function (...args) {
    // Сохраняем текущий контекст выполнения
    const context = this;
    
    // Очищаем предыдущий таймер, если он существует
    clearTimeout(timeout);
    
    // Устанавливаем новый таймер с задержкой wait миллисекунд
    timeout = setTimeout(() => {
      // Вызываем оригинальную функцию func с сохраненным контекстом и аргументами
      func.apply(context, args);
    }, wait);
  };
}

export default defineComponent({
  name: 'HomeView',

  components: {
    WeatherDetails,
    WeatherSearch
  },

  data() {
    return {
      city: '',
      weatherInfo: null,
      errorMessage: '',
      weatherImages: {},
      cities: [],
      filteredCities: [],
      selectedCityTime: null,
      forecast: [],
    };
  },

  watch: {
    '$route.query.city'(newCity) {
      this.city = newCity || '';
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
  },

  mounted() {
    this.city = this.$route.query.city || '';

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

    this.fetchCities();
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

    async fetchCities() {
      try {
        const data = await fetchCitiesData();
         // Преобразуем данные в массив объектов, содержащих имена стран
        this.cities = data.data.map(item => ({
          name: item.city
        }));
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    },

    handleInput() {
      if (this.city.trim().length >= 1) {
        const value = this.city.toLowerCase().trim();
        this.filteredCities = this.cities
          .filter(city =>
            city.name.toLowerCase().startsWith(value)
          )
          .slice(0, 4);
      } else {
        this.filteredCities = [];
      }
    },

    updateCity(newCity) {
      this.city = newCity;
    },

    selectCities(item) {
      this.city = item.name;
      this.filteredCities = [];
      this.updateWeather();
    },

    updateWeather() {
      if (!this.city) {
        this.$router.push({ path: '/', query: {} });
        return;
      }

      this.filteredCities = [];

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
    :error-message="errorMessage"
    :filtered-cities="filteredCities"
    :city-time="selectedCityTime"
    @update-weather="debouncedGetWeather"
    @select-cities="selectCities"
    @handle-input="handleInput"
    @keydown.enter="updateWeather"
  />
  
  <weather-search 
    v-else
    :model-value="city"
    :error-message="errorMessage"
    :filtered-cities="filteredCities"
    @handle-input="handleInput"
    @update:model-value="updateCity"
    @update-weather="debouncedGetWeather"
    @select-cities="selectCities"
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