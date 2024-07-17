<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import WeatherSummary from '@/components/Content/WeatherSummary.vue';
import HighLights from '@/components/Content/HighLights.vue';
import WeeklyForecast from '@/components/Content/WeeklyForecast.vue'

export default defineComponent({
  name: 'WeatherDetails',

  components: {
    AppContainer,
    WeatherSummary,
    HighLights,
    WeeklyForecast
  },

  props: {
    weatherInfo: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: undefined
    },
    cityTime: {
      type: Number,
      required: true,
    },
    cities: {
      type: Array,
      default: () => []
    },
    forecast: { 
      type: Array,
      required: true,
    },
  },

  emits: ['update-weather', 'update:modelValue'],
  
  data() {
    return {
      weatherImages: {},
    };
  },

  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    },
    
    weatherIcon() {
      if (this.weatherInfo) {
        return this.weatherImages[this.weatherInfo.weather[0].description];
      }
      return null;
    }
  },

  mounted() {
    const imageFiles = import.meta.glob('../../assets/img/background/*.png');
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
  },

  methods: {
    updateWeather() {
      this.$emit('update-weather');
    },

    selectCity(city) {
      this.$emit('update:modelValue', city);
      this.$emit('update-weather');
    }
  },
})
</script>

<template>
  <div v-if="weatherInfo" class="weather">
    <div v-if="weatherInfo" class="weather-background">
      <img :src="weatherIcon" alt="Icon" class="background-image">
    </div>
    <app-container size="xl">
      <div class="weather-content">
        <weather-summary
          v-model="inputValue"
          :weather-info="weatherInfo"
          :cities="cities"
          @update-weather="updateWeather"
        />
        
        <high-lights
          :weather-info="weatherInfo"
          :forecast="forecast"
          :current-time="cityTime"
        />
      </div>

      <weekly-forecast 
        v-if="forecast"
        :forecast="forecast"
      />
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

  @media (max-width: 1300px) {
    .weather-content {
      flex-direction: column;
      align-items: center;
    }
    .weather-bottom {
      flex-direction: column;
    }
  }
</style>