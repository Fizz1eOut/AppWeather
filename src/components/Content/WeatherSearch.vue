<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import AppInput from '@/components/Inputs/AppInput.vue';
import CitySuggestions from '@/components/Content/CitySuggestions.vue';

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
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    },
    filteredCities: {
      type: Array,
      default: () => []
    },
  },

  emits: ['update:modelValue', 'select-cities', 'update-weather', 'handle-input'],

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
    updateWeather() {
      this.$emit('update-weather');
    },
    handleSelectCities(item) {
      this.$emit('select-cities', item);
    },
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
            v-model="inputValue"
            placeholder="Enter your city"
            @keydown.enter="updateWeather"
            @input="$emit('handle-input')"
          />

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          
          <city-suggestions
            :filtered-cities="filteredCities"
            @select-city="handleSelectCities"
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