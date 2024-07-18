<script>
import AppContainer from '@/components/Base/AppContainer.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import WeatherChart from '@/components/Content/WeatherChart.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WeeklyForecast',

  components: {
    AppTitle,
    AppContainer,
    AppUnderlay,
    WeatherChart
  },

  props: {
    forecast: {
        type: Array,
        required: true,
    },
  },
  
  data() {
    return {
      weatherImages: {},
      selectedDayData: null, 
      selectedDate: null,
    };
  },

  computed: {
    weeklyForecast() {
      // Создаем пустой объект для хранения данных по дням
      const days = {};
      // console.log(days);
      // console.log(this.forecast);
      // Проходим по каждому элементу массива прогнозов
      this.forecast.forEach(item => {
          // Преобразуем временную метку в дату в формате 'дд.мм.гггг'
          const date = new Date(item.dt * 1000).toLocaleDateString();
          // Если в объекте days еще нет этой даты, добавляем ее
          if (!days[date]) {
              days[date] = [];
          }
          // Добавляем текущий элемент прогноза в массив данных текущей даты
          days[date].push(item);
      });
      // Преобразуем объект days в массив объектов с данными по дням
      return Object.keys(days).map(date => {
          const dayData = days[date];
          // console.log(dayData)
          const maxTemp = Math.max(...dayData.map(d => d.main.temp));
          const minTemp = Math.min(...dayData.map(d => d.main.temp));
          const weather = dayData[0].weather[0].description;
          const dayOfWeek = new Date(dayData[0].dt * 1000).toLocaleDateString('en-EN', { weekday: 'long' });
          return {
              date,
              dayOfWeek,
              maxTemp,
              minTemp,
              weather,
              dayData
          };
      });
    },

    isSelected() {
      return dayForecast => {
        return this.selectedDate === dayForecast.date;
      };
    },


    weatherIcon() {
      return (description) => {
          // console.log(description)
          return this.weatherImages[description];
      };
    }
  },

  watch: {
    forecast() {
      this.selectedDayData = null;
      this.selectedDate = null;
    }
  },

  mounted() {
    // Загрузка иконок при монтировании компонента
    const imageFiles = import.meta.glob('../../assets/img/сlouds/*.png');
    for (const path in imageFiles) {
      imageFiles[path]().then((mod) => {
          // Извлекаем URL изображения из загруженного модуля
          const imageUrl = mod.default;
          // Получаем имя файла из пути
          const fileName = path.split('/').pop().replace('.png', '');
          // Добавляем изображение в объект weatherImages
          this.weatherImages[fileName] = imageUrl;
      });
    }
  },

  methods: {
    selectDay(dayForecast) {
      // Проверяем, если текущая дата совпадает с выбранной, закрываем график
      if (this.selectedDate === dayForecast.date) {
        this.selectedDayData = null;
        this.selectedDate = null;
      } else {
        // Иначе устанавливаем выбранный прогноз
        this.selectedDayData = dayForecast.dayData;
        this.selectedDate = dayForecast.date;
      }
    }
  },
});
</script>

<template>
  <div class="forecast">
    <app-underlay>
      <app-container size="lg">
        <app-title>
          Weather for a week
        </app-title>
        <div class="forecast__body">
          <div 
            v-for="(dayForecast, index) in weeklyForecast" 
            :key="index"
            class="forecast__item"
            :class="{ 'selected': isSelected(dayForecast) }"
            @click="selectDay(dayForecast)"
          >
            <app-underlay>
              <app-container size="md">
                <div>{{ dayForecast.date }}</div>
                <div>{{ dayForecast.dayOfWeek }}</div>
                <div class="forecast__img">
                  <img :src="weatherIcon(dayForecast.weather)" alt="Icon">
                </div>
                <div class="forecast__temp">
                  <div class="forecast__temp--max">{{ Math.round(dayForecast.maxTemp) }} °C</div>
                  <div class="forecast__temp--min">{{ Math.round(dayForecast.minTemp) }} °C</div>
                </div>
              </app-container>
            </app-underlay>
          </div>
        </div>
        <Transition name="bounce">
          <weather-chart 
            v-if="selectedDayData" 
            :day-data="selectedDayData" 
            :date="selectedDate"
            class="weather-chart"
          />
        </Transition>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .forecast {
    margin-top: 40px;
  }
  .forecast__body {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .forecast__item {
    text-align: center;
    cursor: pointer;
  }
  .forecast__temp {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .forecast__img img {
    max-width: 100%;
  }
  .forecast__temp--max {
    color: var(--color-white);
  }
  .forecast__item.selected {
    border: 2px solid var(--color-white);
    border-radius: 40px;
  }
  .weather-chart {
    margin-top: 20px;
  }
  @media (max-width: 1068px) {
    .forecast__body {
      overflow-y: auto;
    }
    .forecast__temp--max,
    .forecast__temp--min {
      font-size: 16px;
    }
  }

  .bounce-enter-active {
    animation: bounce-in 0.9s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.6s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>