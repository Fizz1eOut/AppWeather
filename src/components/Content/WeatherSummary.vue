<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppDivider from '@/components/Base/AppDivider.vue';
import IconLocality from '@/components/Icons/IconLocality.vue';
import IconCalendar from '@/components/Icons/IconCalendar.vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

export default defineComponent({
  name: 'WeatherSummary',

  components: {
    AppContainer,
    AppUnderlay,
    AppDivider,
    IconLocality,
    IconCalendar,
    Multiselect
  },

  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    weatherInfo: {
      type: [Object, String, Number],
      default: null
    },
    cities: {
      type: Array,
      default: () => []
    },
    errorMessage: {
      type: String,
      default: ''
    },
  },

  emits: ['update:modelValue', 'fetch-cities', 'update-weather'],

  data() {
    return {
      weatherImages: {},
    };
  },

  computed: {
    inputValue: {
      get() {
        return this.modelValue || '';
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
    const imageFiles = import.meta.glob('../../assets/img/сlouds/*.png');
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

    if (this.modelValue) {
      this.$emit('fetch-cities', this.modelValue);
    }
  },

  methods: {
    formatDate() {
      const today = new Date().toLocaleString('en-EN', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return today;
    },

    capitalizeFirstLetter(string) {
      if (typeof string !== 'string' || !string.length) {
        return '';
      }
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    onSearchChange(searchText) {
      if (searchText.length > 2) {
        this.$emit('fetch-cities', searchText);
      }
    },
  }
});
</script>

<template>
  <div class="weather-summary">
    <app-underlay>
      <app-container size="lg">
        <div class="weather-summary__header">      
          <multiselect
            v-model="inputValue"
            :options="cities"
            :multiple="false"
            :limit="100"
            infinite
            searchable
            placeholder="Enter your city"
            label="name"
            value-prop="name"
            clear-on-select
            close-on-select
            :allow-empty="false"
            @search-change="onSearchChange"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>

        <div class="weather-summary__body">
          <div class="weather-summary__content">
            <div class="weather-summary__temperature">{{ Math.round(weatherInfo?.main?.temp) }} °С</div>
            <div class="weather-summary__description"> {{ capitalizeFirstLetter(weatherInfo?.weather[0]?.description) }}</div>
            <div class="weather-summary__option">Feels like: {{ Math.round(weatherInfo?.main?.feels_like) }} °С</div>
            <div class="weather-summary__option">Cloudiness: {{ weatherInfo?.clouds?.all }} %</div>
            <div class="weather-summary__option">Humidity: {{ weatherInfo?.main.humidity }} %</div>
          </div>

          <div v-if="weatherInfo" class="weather-summary__image">
            <img :src="weatherIcon" alt="Icon">
          </div>
        </div>

        <AppDivider class="weather-summary__divider" />

        <div class="weather-summary__bottom">
          <div class="weather-summary__row">
            <IconLocality class="weather-summary__icon-locality" />
            <div class="weather-summary__locality">
              {{ weatherInfo?.name }},
              {{ weatherInfo?.sys?.country }}
            </div>
          </div>

          <div class="weather-summary__row">
            <IconCalendar class="weather-summary__icon-calendar" />
            <div class="weather-summary__calendar">{{ formatDate() }}</div>
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
  .error-message {
    color: red;
    margin-top: 8px;
  }
  .multiselect,
  .multiselect .multiselect-search {
    border-radius: 30px;
  }
  .multiselect-search {
    color: var(--color-black);
    background: var(--color-transparent-white);
    backdrop-filter: blur(12px);
  }
  .weather-summary {
    max-width: 366px;
    width: 100%;
  }
  .weather-summary__header {
    position: relative;
  }
  .weather-summary__icon-search {
    position: absolute;
    top: 11.5px;
    right: 30px;
    width: 30px;
    height: 30px;
  }
  .weather-summary__body {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .weather-summary__temperature {
    font-weight: 500;
    font-size: 50px;
    color: var(--color-black);
  }
  .weather-summary__description {
    font-weight: 400;
    font-size: 30px;
    line-height: 30px;
    color: var(--color-black);
    margin-bottom: 10px;
  }
  .weather-summary__option {
    font-weight: 400;
    font-size: 20px;
    color: var(--color-black);
  }
  .weather-summary__image {
    width: 150px;
    height: 150px;
  }
  .weather-summary__divider {
    margin: 20px 0;
  }
  .weather-summary__image img {
    width: 100%;
    height: 100%;
  }
  .weather-summary__row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .weather-summary__row:not(:last-child) {
    margin-bottom: 10px;
  }
  .weather-summary__icon-locality {
    width: 30px;
    height: 30px;
  }
  .weather-summary__locality {
    font-weight: 400;
    font-size: 20px;
    color: var(--color-black);
  }
  .weather-summary__icon-calendar {
    width: 30px;
    height: 30px;
  }
  .weather-summary__calendar {
    font-weight: 400;
    font-size: 20px;
    color: var(--color-black);
  }
  @media (max-width: 1300px) {
    .weather-summary {
      max-width: 600px;
      width: 100%;
    }
  }
  @media (max-width: 360px) {
    .weather-summary__image {
      width: 130px;
      height: 130px;
    }
    .weather-summary__temperature {
      font-size: 42px;
    }
    .weather-summary__description {
      font-size: 24px;
    }
    .weather-summary__icon-search {
      display: none;
    }
  }
</style>