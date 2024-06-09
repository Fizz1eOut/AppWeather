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
    }
  },

  data() {
    return {
      series: [
        {
          name: "Wind Speed",
          data: [0],
        },
      ],

      chartOptions: {
        chart: {
          type: 'line', // Тип графика - линейный
          height: 350, // Высота графика
          zoom: {
            enabled: false, // Отключаем возможность увеличения графика
          },
      },

      dataLabels: {
        enabled: false, // Отключаем отображение подписей данных
      },

      stroke: {
        curve: 'straight', // График с плавными кривыми
      },

      title: {
        text: 'Wind Speed Over Time', // Заголовок графика
        align: 'left', // Выравнивание заголовка по левому краю
      },

         // Категории для оси X, инициализируются из пропсов, ограничение до первых 4 элементов
        xaxis: {
          categories: this.timeData.slice(0, 4),
        },

        yaxis: {
          // Заголовок для оси Y
          title: {
            text: 'Speed (m/s)',
          },
        },
      },
    };
  },

watch: {
  windData: function(newVal) {
    // console.log(newVal);
    const newData = [0, ...newVal];
    // Устанавливаем данные графика
    this.series[0].data = newData;
  },
  timeData: function(newVal) {  
    // console.log(newVal);
    this.chartOptions.xaxis.categories = newVal;
  }
},

  mounted() {
    // Добавляем фиксированный ноль к началу данных о скорости ветра
    const newData = [0, ...this.windData];
    // Устанавливаем данные графика
    this.series[0].data = newData;

    // Устанавливаем категории для оси X
    this.chartOptions.xaxis.categories = this.timeData;
  },
});
</script>

<template>
  <div>
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped>
.apexcharts-tooltip {
  color: #000;
}
</style>