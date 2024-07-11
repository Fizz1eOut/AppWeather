<script>
import { defineComponent } from 'vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import VueApexCharts from 'vue3-apexcharts';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppContainer from '@/components/Base/AppContainer.vue';

export default defineComponent({
  name: 'WeatherChart',

  components: {
    apexchart: VueApexCharts,
    AppTitle,
    AppContainer,
    AppUnderlay,
},

  props: {
    dayData: {
      type: Array,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'line',
          height: '350px', // Устанавливаем максимальную высоту
          zoom: {
            enabled: false // Отключение возможности прокрутки графика
          }
        },

        xaxis: {
          categories: this.dayData.map(data => {
            const date = new Date(data.dt * 1000);
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
          }),
          labels: {
            style: {
              colors: '#282828' // Цвет текста меток оси X
            }
          }
        },

        yaxis: {
          title: {
            text: 'Temperature (°C)',
            style: {
              color: '#282828', // Цвет текста заголовка
            },
          }
        },

        title: {
          text: `Temperature on ${this.date}`,
          style: {
            color: '#282828' // Цвет текста заголовка
          }
        },
      };
    },

    series() {
      return [
        {
          name: 'Temperature',
          data: this.dayData.map(data => Math.round(data.main.temp)),
        }
      ];
    }
  }
});
</script>

<template>
  <div class="weather-chart">
    <app-underlay>
      <app-container size="md">
        <AppTitle>
          Weather Chart for {{ date }}
        </AppTitle>
        <apexchart
          type="line"
          :options="chartOptions"
          :series="series"
          class="apex-chart"
          height="350"
        />
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
.apex-chart {
  margin-top: 20px;
}
</style>