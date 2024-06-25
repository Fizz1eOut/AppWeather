<script>
import { API_KEY, BASE_URL } from '@/api/script';
import { defineComponent } from 'vue';
import WeatherDetails from '@/components/Content/WeatherDetails.vue';
import WeatherSearch from '@/components/Content/WeatherSearch.vue';
import debounce from 'lodash/debounce';

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
      windData: [],
      timeData: [],
      windGusts: [],
      cities: [],
      filteredCities: [],
      selectedCityTime: null,
    };
  },

  watch: {
    '$route.query.city'(newCity) {
      this.resetWindData()
      this.city = newCity || '';
      if (this.city) {
        this.debouncedGetWeather();
      } else {
        this.weatherInfo = null;
        this.errorMessage = '';
        this.resetWindData()
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

    this.startWindDataCollection();
    this.fetchCities();
  },

  methods: {
    async getWeather() {
      if (!this.city) return;
      try {
        const response = await fetch(`${BASE_URL}?q=${this.city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        this.weatherInfo = data;
        this.errorMessage = '';
        this.updateWindData();

        this.selectedCityTime = new Date().getTime() / 1000 + data.timezone;
      } catch (error) {
        this.errorMessage = 'Failed to retrieve weather data. Please check if you entered the city correctly';
        this.resetWindData()
      }
    },
    
    async getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
          const data = await response.json();
          this.weatherInfo = data;
          this.errorMessage = '';
          this.updateWindData();

          this.selectedCityTime = new Date().getTime() / 1000 + data.timezone;
        });
      }
    },

    async fetchCities() {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const responseData = await response.json();
        // console.log(responseData)
         // Преобразуем данные в массив объектов, содержащих имена стран
        this.cities = responseData.data.map(item => ({
          name: item.city
        }));
        // console.log(this.cities)
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

    updateWindData() {
      if (this.weatherInfo) {
        const currentSpeed = this.weatherInfo.wind.speed;
        const currentGusts = this.weatherInfo?.wind.gust;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.windData.unshift(currentSpeed);
        this.timeData.unshift(currentTime);

        if (currentGusts !== undefined) {
          this.windGusts.unshift(currentGusts);
        }

        // Проверяем длину массивов и удаляем лишние элементы
        if (this.windData.length > 4) {
          this.windData.pop();
          // console.log(this.windData);
        }
        if (this.windGusts.length > 4) {
          this.windGusts.pop();
          // console.log(this.windGusts);
        }
        if (this.timeData.length > 4) {
          this.timeData.pop();
          // console.log(this.timeData);
        }
      }
    },

    startWindDataCollection() {
      setInterval(async () => {
        this.updateWindData();
      }, 6000); // Обновление каждые 6 сек
    },

    resetWindData() {
      this.windData = [];
      this.timeData = [];
      this.windGusts = [];
    },
  }
});
</script>

<template>
  <weather-details
    v-if="weatherInfo"
    :weather-info="weatherInfo"
    :model-value="city"
    :error-message="errorMessage"
    :filtered-cities="filteredCities"
    :wind-data="windData"
    :time-data="timeData"
    :wind-gusts="windGusts"
    :handle-input="handleInput"
    :select-cities-prop="selectCities"
    :city-time="selectedCityTime"
    :cities="cities"
    @update-weather="updateWeather"
    @update:model-value="updateCity"
    @select-cities="selectCities"
  />

  <weather-search 
    v-else
    :model-value="city"
    :error-message="errorMessage"
    :filtered-cities="filteredCities"
    :handle-input="handleInput"
    @update:model-value="updateCity"
    @update-weather="updateWeather"
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