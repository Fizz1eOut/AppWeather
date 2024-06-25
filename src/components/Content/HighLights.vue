<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import HighLightsContent from '@/components/Content/HighLightsContent.vue';
import AppSubtitle from '@/components/Base/AppSubtitle.vue';
import IconSunrise from '@/components/Icons/IconSunrise.vue';
import IconSunset from '@/components/Icons/IconSunset.vue';
import WindChart from '@/components/Content/WindChart.vue';
import SunChart from '@/components/Content/SunChart.vue'

export default defineComponent({
  name: 'HighLights',

  components: {
    AppContainer,
    AppUnderlay,
    AppTitle,
    HighLightsContent,
    AppSubtitle,
    IconSunrise,
    IconSunset,
    WindChart,
    SunChart
  },

  props: {
    weatherInfo: {
      type: Object,
      default: null
    },
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
    currentTime: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      pressure: 0.750062,
    };
  },

  computed: {
    timezone() {
      return this.weatherInfo?.timezone;
    },
    sunriseTime() {
      return this.weatherInfo?.sys?.sunrise + this.timezone;
    },
    sunsetTime() {
      return this.weatherInfo?.sys?.sunset + this.timezone;
    },
    getPressureMn() {
      const hpa = this.weatherInfo?.main?.pressure;
      return hpa ? Math.round(hpa * this.pressure) : 0;
    }
  },



  methods: {  
    getTime(seconds) {
      return new Date(seconds * 1000).toLocaleTimeString('uk-UA', { timeZone: 'Atlantic/Reykjavik' });
    },
  }
});
</script>

<template>
  <div class="high-lights">
    <app-underlay>
      <app-container size="lg">
        <app-title>
          Today's Highlights
        </app-title>

        <div class="high-lights__body">
          <div class="high-lights__item">
            <high-lights-content>
              <template #title>
                <app-subtitle>Wind</app-subtitle>
              </template>

              <wind-chart :wind-data="windData" :time-data="timeData" :wind-gusts="windGusts" />

              <template #text>
                <span>{{ weatherInfo?.wind?.speed }} m/s</span>
                <template v-if="weatherInfo?.wind?.gust">
                  <span>{{ weatherInfo?.wind?.gust }} m/s</span>
                </template>
              </template>
            </high-lights-content>
          </div>

          <div class="high-lights__item">
            <high-lights-content>
              <template #title>
                <app-subtitle>Pressure</app-subtitle>
              </template>

              <img src="../../assets/img/icons/barometer.png" alt="Graph">

              <template #text>
                <span>{{ getPressureMn }} mm</span>
              </template>
            </high-lights-content>
          </div>

          <div class="high-lights__item">
            <high-lights-content>
              <template #title>
                <app-subtitle>Sunrise and sunset</app-subtitle>
              </template>

              <sun-chart 
                :sunrise="sunriseTime" 
                :sunset="sunsetTime" 
                :current-time="currentTime"
              />
              
              <template #text>
                <div class="high-lights__wrapper">
                  <div class="high-lights__sunrise">
                    <icon-sunrise class="sunrise" />
                    <div class="">Sunrise</div>
                    <div class="high-lights__time">{{ getTime(sunriseTime) }}</div>
                  </div>

                  <div class="high-lights__sunset">
                    <icon-sunset class="sunset" />
                    <div class="">Sunset</div>
                    <div class="high-lights__time">{{ getTime(sunsetTime) }}</div>
                  </div>
                </div>
              </template>
            </high-lights-content>
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style>
  .windy {
    min-width: 25px;
    height: 20px;
  }
  .cloud {
    min-width: 25px;
    height: 20px;
  }
  .sunrise {
    min-width: 25px;
    height: 25px
  }
  .sunset {
    min-width: 25px;
    height: 25px
  }
  .temp {
    min-width: 8px;
    height: 26px;
  }
  .link {
    text-decoration: underline;
    color: var(--color-black);
  }
  .error {
    font-size: 18px;
  }
  .high-lights {
    width: 100%;
  }
  .high-lights__body {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
  }
  .high-lights__item {
    width: 100%;
  }
  .high-lights__wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
  .high-lights__sunrise {
    font-weight: 400;
    font-size: 14px;
    color: var(--color-black);
  }
  .high-lights__sunset {
    font-weight: 400;
    font-size: 14px;
    color: var(--color-black);
  }
  @media (max-width: 869px) {
    .high-lights__body {
      flex-wrap: wrap;
      row-gap: 20px;
      column-gap: 20px;
      justify-content: center;
    }
    .high-lights__item {
      max-width: 300px;
    }
  }
  @media (max-width: 869px) {
    .high-lights__item {
      max-width: 260px;
    }
  }
  @media (max-width: 620px) {
    .high-lights__item {
      max-width: 100%;
    }
    .high-lights__wrapper {
      max-width: 300px;
    }
  }
  @media (max-width: 440px) {
    .high-lights__row {
      align-items: flex-start;
    }
  }
</style>