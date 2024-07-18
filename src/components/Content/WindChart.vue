<script>
import { defineComponent } from 'vue';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'WindChart',

  components: {
    apexchart: ApexCharts,
  },

  props: {
    forecast: {
      type: Array,
      required: true
    },
    currentTime: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      series: [
        {
          name: "Wind Speed (m/s)",
          data: [],
        },
        {
          name: "Wind Gusts (m/s)",
          data: [],
        }
      ],

      chartOptions: {
        chart: {
          type: 'line',
          height: 200,
          zoom: {
            enabled: false,
          },
        },

        dataLabels: {
          enabled: false,
        },

        stroke: {
          curve: 'straight',
        },

        xaxis: {
          categories: [],
          labels: {
            format: 'HH:mm',
          },
        },

        yaxis: {
          title: {
            text: 'Speed (m/s)',
          },
        },

        title: {
          text: '', // Заголовок графика
          align: 'center' // Выравнивание заголовка по центру
        }
      },
    };
  },

  watch: {
    // Наблюдаем за изменениями в свойстве forecast
    forecast: {
      // Обработчик изменений
      handler(newForecast) {
        // Вызываем метод updateChart при изменении forecast
        this.updateChart(newForecast);
      },
      // Запускаем обработчик немедленно при монтировании компонента
      immediate: true
    },
    // Наблюдаем за изменениями в свойстве currentTime
    currentTime: {
      // Обработчик изменений
      handler() {
        // Вызываем метод updateChart при изменении currentTime
        this.updateChart(this.forecast);
      },
      // Запускаем обработчик немедленно при монтировании компонента
      immediate: true
    }
  },

  mounted() {
    // Вызываем метод updateChart при монтировании компонента, передавая текущее значение forecast
    this.updateChart(this.forecast);
  },

  methods: {
    updateChart(forecast) {
      // console.log(forecast);
      // Вычисляем смещение временной зоны браузера в секундах
      const browserTimeOffset = new Date().getTimezoneOffset() * 60;

      // Вычисляем смещение временной зоны города относительно текущего времени в секундах
      const cityTimeOffset = this.currentTime - Math.floor(Date.now() / 1000);

      // Вычисляем общее смещение времени для корректировки прогноза
      const totalOffset = cityTimeOffset + browserTimeOffset;
      
      // Корректируем прогноз, добавляя общее смещение ко времени каждого элемента
      const adjustedForecast = forecast.map(item => {
        const adjustedTime = new Date((item.dt + totalOffset) * 1000);
        return {
          ...item,
          adjustedTime
        };
      });

      // Фильтруем откорректированный прогноз для текущей даты
      const filteredForecast = adjustedForecast.filter(item => {
        const forecastDate = item.adjustedTime;
        const currentDate = new Date();
        return (
          forecastDate.getDate() === currentDate.getDate() &&
          forecastDate.getMonth() === currentDate.getMonth() &&
          forecastDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Формируем данные о скорости ветра для графика
      const windSpeedData = filteredForecast.map(item => ({
        x: item.adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        y: item.wind.speed
      }));

      // Формируем данные о порывах ветра для графика
      const windGustsData = filteredForecast.map(item => ({
        x: item.adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        y: item.wind.gust || 0
      }));

      // Обновляем данные серий графика
      this.series = [
        {
          name: "Wind Speed",
          data: windSpeedData
        },
        {
          name: "Wind Gusts",
          data: windGustsData
        }
      ];

      // Обновляем категории оси X для графика
      const categories = windSpeedData.map(item => item.x);

      // Обновляем заголовок графика с текущим временем города
      const cityCurrentTime = new Date((this.currentTime + browserTimeOffset) * 1000);
      const title = `City Time: ${cityCurrentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // Создаем новый объект chartOptions, чтобы Vue.js отслеживал изменения
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories,
        },
        title: {
          ...this.chartOptions.title,
          text: title
        }
      };
      // console.log(this.chartOptions)
    }
  }
});
</script>

<template>
  <div v-if="series[0].data.length > 0" class="chart-container">
    <apexchart
      type="line"
      :options="chartOptions"
      :series="series"
      height="200"
    />
  </div>
  <div v-else>
    <p>Wind data chart is temporarily unavailable</p>
  </div>
</template>

<style scoped>

</style>