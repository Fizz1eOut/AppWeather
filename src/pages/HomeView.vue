<script>
import AppContainer from '@/components/Base/AppContainer.vue';
import { API_KEY, BASE_URL } from '@/assets/api/script';
import { defineComponent } from 'vue';
import WeatherSummary from '@/components/Content/WeatherSummary.vue';
import HighLights from '@/components/Content/HighLights.vue';
import TheCoordinates from '@/components/Content/TheCoordinates.vue';
import TheHumidity from '@/components/Content/TheHumidity.vue';
import AppInput from '@/components/Inputs/AppInput.vue';
import AppTitle from '@/components/Base/AppTitle.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    AppContainer,
    WeatherSummary,
    HighLights,
    TheCoordinates,
    TheHumidity,
    AppInput,
    AppTitle
},

  data() {
    return {
      city: '',
      weatherInfo: null,
      errorMessage: '',
      weatherImages: {},
      windData: [],
      timeData: [],
    };
  },

  watch: {
    '$route.query.city'(newCity) {
      this.city = newCity || '';
      if (this.city) {
        this.getWeather();
      } else {
        this.weatherInfo = null;
        this.errorMessage = '';
      }
    }
  },

  mounted() {
    this.city = this.$route.query.city || '';

    if (this.city) {
      this.getWeather();
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
      } catch (error) {
        this.errorMessage = 'Failed to retrieve weather data. Please check if you entered the city correctly';
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
        });
      }
    },

    updateWeather() {
      if (!this.city) {
        this.$router.push({ path: '/', query: {} });
        return;
      }

      this.$router.push({ query: { city: this.city } });
      this.getWeather();
    },

    getWeatherIcon(description) {
      return this.weatherImages[description];
    },

    updateWindData() {
      if (this.weatherInfo) {
        const currentSpeed = this.weatherInfo.wind.speed;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Добавляем текущие данные о скорости ветра в начало массива
        this.windData.unshift(currentSpeed);
        // Используем текущее время вместо времени из массива timeData
        this.timeData.unshift(currentTime);

        // Проверяем длину массивов и удаляем лишние элементы
        const maxDataPoints = 4;
        if (this.windData.length > maxDataPoints) {
          this.windData = this.windData.slice(0, maxDataPoints);
          // console.log(this.windData)
        }
        if (this.timeData.length > maxDataPoints) {
          this.timeData = this.timeData.slice(0, maxDataPoints);
          // console.log(this.windData)
        }
      }
    },

    startWindDataCollection() {
      setInterval(async () => {
        await this.getWeather();
        this.updateWindData();
      }, 6000); // Обновление каждые 6 сек
    },
  }
});
</script>

<template>
  <div v-if="weatherInfo" class="weather">
    <div v-if="weatherInfo" class="weather-background">
      <img :src="getWeatherIcon(weatherInfo.weather[0].description)" alt="Icon" class="background-image">
    </div>
    <app-container size="xl">
      <div class="weather-content">
        <weather-summary 
          v-model="city"
          :weather-info="weatherInfo"
          :error-message="errorMessage"
          @get-weather="updateWeather"
        />

        <high-lights :weather-info="weatherInfo" :wind-data="windData" :time-data="timeData" />
      </div>

      <div class="weather-bottom">
        <the-coordinates :weather-info="weatherInfo" />
        <the-humidity :weather-info="weatherInfo" />
      </div>
    </app-container>
  </div>

  <div v-else>
    <div class="weather-container">
      <app-container size="md">
        <div class="weather-wrapper">
          <app-title class="weather-container__title">
            Weather App
          </app-title>
          
          <app-input
            v-model="city"
            placeholder="Enter your city"
            class="weather-container__input"
            @keydown.enter="updateWeather"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </app-container>
    </div>
  </div>
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