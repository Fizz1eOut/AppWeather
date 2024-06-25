<script>
import { defineComponent } from 'vue';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'WindChart',

  components: {
    apexchart: ApexCharts,
  },

  props: {
    windData: {
      type: Array,
      required: true,
    },
    timeData: {
      type: Array,
      required: true,
    },
    windGusts: { 
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      series: [
        {
          name: "Wind Speed",
          data: [],
        },
        {
          name: "Wind Gusts",
          data: [],
        }
      ],

      chartOptions: {
        chart: {
          type: 'line',
          height: 350,
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
        },

        yaxis: {
          title: {
            text: 'Speed (m/s)',
          },
        },
      },
    };
  },

  watch: {
    // Обработка изменений в массиве windData
    windData(newVal) {
      this.series[0].data = newVal;
    },
    // Обработка изменений в массиве timeData
    timeData(newVal) {
      this.chartOptions.xaxis.categories = newVal;
    },
    // Обработка изменений в windGusts
    windGusts(newVal) {
      if (typeof newVal === 'number') {
        this.series[1].data = [newVal];
      } else if (Array.isArray(newVal)) { 
        this.series[1].data = newVal;
      }
    }
  },

  mounted() {
    // Инициализация данных графика при монтировании компонента
    this.series[0].data = this.windData;
    this.series[1].data = this.windGusts; // добавили эту строку
    this.chartOptions.xaxis.categories = this.timeData;
  },
});
</script>

<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped>

</style>