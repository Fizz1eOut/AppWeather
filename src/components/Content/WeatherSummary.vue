<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppInput from '@/components/Inputs/AppInput.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import IconSearch from '@/components/Icons/IconSearch.vue';
import AppDivider from '@/components/Base/AppDivider.vue';
import IconLocality from '@/components/Icons/IconLocality.vue';
import IconCalendar from '@/components/Icons/IconCalendar.vue';

export default defineComponent({
  name: 'WeatherSummary',

  components: {
    AppContainer,
    AppInput,
    AppUnderlay,
    IconSearch,
    AppDivider,
    IconLocality,
    IconCalendar
},

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    weatherInfo: {
      type: [Object, String, Number],
      default: null
    },
  },

  emits: ['update:modelValue', 'getWeather'],

  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    },
  },

  methods: {
    getWeather() {
      this.$emit('getWeather');
    },

    getWeatherIcon(description) {
      // Заменяем пробелы на %20
      const formattedDescription = description.replace(/ /g, '%20');
      // Формируем путь к изображению на основе данных
      return `src/assets/img/сlouds/${formattedDescription}.png`;
    },

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
  }
});
</script>

<template>
  <div class="weather-summary">
    <app-underlay>
      <app-container size="lg">
        <div class="weather-summary__header">
          <app-input 
            v-model="inputValue"
            placeholder="Enter your city"
            @keydown.enter="getWeather"
          />
          <IconSearch class="weather-summary__icon-search" />
        </div>

        <div class="weather-summary__body">
          <div class="weather-summary__content">
            <div class="weather-summary__temperature">{{ Math.round(weatherInfo?.main?.temp) }} °С</div>
            <div class="weather-summary__description"> {{ capitalizeFirstLetter(weatherInfo?.weather[0]?.description) }} </div>
          </div>

          <div v-if="weatherInfo" class="weather-summary__image">
            <img :src="getWeatherIcon(weatherInfo?.weather[0]?.description)" alt="Icon">
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

<style scoped>
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
    margin-bottom: 20px;
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
</style>