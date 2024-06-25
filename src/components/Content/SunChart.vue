<script>
import { defineComponent } from 'vue';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'SunChart',

  components: {
    apexchart: ApexCharts,
  },

  props: {
    sunrise: {
      type: Number,
      required: true,
    },
    sunset: {
      type: Number,
      required: true,
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
          name: 'Sun path',
          data: [],
        },
        {
          name: 'Current Time',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },

        stroke: {
          curve: 'smooth',
        },

        markers: {
          size: [5, 5],
          colors: ['#FFA41B', '#00e396'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },

        xaxis: {
          type: 'datetime',
          labels: {
            format: 'HH:mm',
          },
        },

        yaxis: {
          show: false,
        },

        tooltip: {
          x: {
            format: 'HH:mm',
          },
          y: {
            formatter(value, { seriesIndex, dataPointIndex }) {
              if (seriesIndex === 0 && (dataPointIndex === 0 || dataPointIndex === 2)) {
                return '';
              }
              if (seriesIndex === 1 && dataPointIndex === 0) {
                return '';
              }
              return value;
            },
          },
        },
      },
    };
  },

  watch: {
    currentTime() {
      this.updateChart();
    },
  },

  mounted() {
    this.updateChart();
  },

  methods: {
    updateChart() {
      const sunriseTime = this.sunrise * 1000;
      const sunsetTime = this.sunset * 1000;
      const currentTime = this.currentTime * 1000;
      const noonTime = sunriseTime + (sunsetTime - sunriseTime) / 2;

      this.series[0].data = [
        { x: sunriseTime, y: 0 },
        { x: noonTime, y: 1 },
        { x: sunsetTime, y: 0 },
      ];

      this.series[1].data = [
        { x: currentTime, y: this.getCurrentSunPosition(currentTime, sunriseTime, noonTime, sunsetTime) },
      ];
    },

    getCurrentSunPosition(time, sunriseTime, noonTime, sunsetTime) {
      if (time <= sunriseTime) return 0;
      if (time >= sunsetTime) return 0;

      if (time === noonTime) return 1;
      if (time < noonTime) {
        return (time - sunriseTime) / (noonTime - sunriseTime);
      } else {
        return (sunsetTime - time) / (sunsetTime - noonTime);
      }
    },
  },
});
</script>

<template>
  <div id="sun-chart">
    <apexchart
      type="line"
      height="150"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<style scoped>

</style>