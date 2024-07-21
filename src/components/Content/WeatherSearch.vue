<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import AppInput from '@/components/Inputs/AppInput.vue';
import CitySuggestions from '@/components/Content/CitySuggestions.vue';
import { debounce, capitalizeFirstLetter } from '@/api/utils';

export default defineComponent({
  name: 'WeatherSearch',
  
  components: {
    AppContainer,
    AppTitle,
    AppInput,
    CitySuggestions
  },

  props: {
    modelValue: {
      type: String,
      default: undefined
    },
    errorMessage: {
      type: String,
      default: ''
    },
    cities: {
      type: Array,
      required: true
    },
  },

  emits: ['update:modelValue', 'fetch-cities'],

  data() {
    return {
      city: ''
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

    filteredCities() {
      const value = this.city.trim().toLowerCase();
      if (value.length <= 1) {
        return [];
      }
      return this.cities;
    }
  },

  watch: {
    city: debounce(function(newCity) {
      if (newCity.length > 2) {
        this.$emit('fetch-cities', newCity);
      }
    }, 300) // Используем debounce для уменьшения количества запросов
  },

  methods: {
    updateWeather() {
      this.inputValue = capitalizeFirstLetter(this.city);
    },
    selectCity(city) {
      this.inputValue = city.name;
    }
  }
});
</script>

<template>
  <div class="weather-container">
    <app-container size="md">
      <div class="weather-wrapper">
        <app-title class="weather-container__title">
          Weather App
        </app-title>

        <div class="input-container">
          <app-input
            v-model="city"
            placeholder="Enter your city"
            @keydown.enter="updateWeather"
          />

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          
          <city-suggestions
            :filtered-cities="filteredCities"
            @select-city="selectCity"
          />
        </div>
      </div>
    </app-container>
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
.input-container {
  position: relative;
}
.error-message {
  color: red;
  margin-top: 8px;
}
</style>