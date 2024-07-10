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
          height: 250,
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
    forecast: {
      handler(newForecast) { // Обработчик изменений в prop forecast
        this.updateChart(newForecast); // Обновляем график при изменении forecast
      },
      immediate: true // Обработчик срабатывает сразу после создания компонента
    }
  },

  methods: {
    updateChart(forecast) {
      const startTime = new Date(); // Текущая дата и время
      startTime.setHours(0, 0, 0, 0); // Устанавливаем начало дня (00:00)
      const endTime = new Date(startTime); // Копируем начало дня
      endTime.setDate(endTime.getDate() + 1); // Устанавливаем конец дня (24:00)

      const filteredForecast = forecast.filter(item => {
        const forecastTime = new Date(item.dt * 1000); // Конвертируем время прогноза
        return forecastTime >= startTime && forecastTime < endTime; // Отфильтровываем данные для текущего дня
      });

      const windSpeedData = filteredForecast.map(item => ({
        x: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Время
        y: item.wind.speed // Скорость ветра
      }));

      const windGustsData = filteredForecast.map(item => ({
        x: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Время
        y: item.wind.gust || 0 // Порывы ветра (если отсутствует, то 0)
      }));

      this.series = [
        {
          name: "Wind Speed (m/s)", // Обновляем данные для первой серии
          data: windSpeedData
        },
        {
          name: "Wind Gusts (m/s)", // Обновляем данные для второй серии
          data: windGustsData
        }
      ];

      this.chartOptions.xaxis.categories = windSpeedData.map(item => item.x); // Обновляем категории оси X
    }
  },

  onMounted() {
    this.updateChart(this.forecast); // Обновляем график при монтировании компонента
  }
});
</script>

<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped>

</style>