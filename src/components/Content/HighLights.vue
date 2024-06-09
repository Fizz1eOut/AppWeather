<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import HighLightsContent from '@/components/Content/HighLightsContent.vue';
import AppSubtitle from '@/components/Base/AppSubtitle.vue';
import IconWindy from '@/components/Icons/IconWindy.vue';
import IconThermometer from '@/components/Icons/IconThermometer.vue';
import IconCloud from '@/components/Icons/IconCloud.vue';
import IconSunrise from '@/components/Icons/IconSunrise.vue';
import IconSunset from '@/components/Icons/IconSunset.vue';
import HighLightsBottom from '@/components/Content/HighLightsBottom.vue';
import WindChart from '@/components/Content/WindChart.vue';

export default defineComponent({
  name: 'HighLights',

  components: {
    AppContainer,
    AppUnderlay,
    AppTitle,
    HighLightsContent,
    AppSubtitle,
    IconWindy,
    IconThermometer,
    IconCloud,
    IconSunrise,
    IconSunset,
    HighLightsBottom,
    WindChart
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
      return this.getTime(this.weatherInfo?.sys?.sunrise + this.timezone);
    },
    sunsetTime() {
      return this.getTime(this.weatherInfo?.sys?.sunset + this.timezone);
    },
  },

  methods: {  
    getTime(seconds) {
      return new Date(seconds * 1000).toLocaleTimeString('uk-UA', { timeZone: 'Atlantic/Reykjavik' });
    },

    getPressureMn(hpa) {
      return Math.round(hpa * this.pressure);
    },
  },
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

              <wind-chart :wind-data="windData" :time-data="timeData" />

              <template #text>
                <span>{{ weatherInfo?.wind?.speed }} m/s</span>
                <span>{{ weatherInfo?.wind?.deg }} deg</span>
              </template>
            </high-lights-content>

            <high-lights-bottom>
              <template #title>
                <app-subtitle>Wind gusts</app-subtitle>
              </template>
              <template #text>
                <div v-if="weatherInfo?.wind?.gust">
                  {{ Math.round(weatherInfo?.wind?.gust) }} m/s
                </div>
                <div v-else>
                  <span class="error">There are no gusts of wind</span>
                </div>
              </template>

              <template #row>
                <icon-windy class="windy" />
                <span>
                  Learn 
                  <a class="link" href="https://www.windy.com/articles/weather-phenomena-what-s-the-difference-between-sustained-winds-and-wind-gusts-10390?satellite,7.787,115.115,5">more</a>
                  about gusts
                </span>
              </template>
            </high-lights-bottom>
          </div>

          <div class="high-lights__item">
            <high-lights-content>
              <template #title>
                <app-subtitle>Pressure</app-subtitle>
              </template>

              <img src="../../assets/img/icons/barometer.png" alt="Graph">

              <template #text>
                <span>{{ getPressureMn(weatherInfo?.main?.pressure) }} mm</span>
              </template>
            </high-lights-content>

            <high-lights-bottom>
              <template #title>
                <app-subtitle>Feels like</app-subtitle>
              </template>
              <template #text>
                {{ Math.round(weatherInfo?.main?.feels_like) }} °С
              </template>

              <template #row>
                <icon-thermometer class="temp" />
                <span>How hot or cold it really feels</span>
              </template>
            </high-lights-bottom>
          </div>

          <div class="high-lights__item">
            <high-lights-content>
              <template #title>
                <app-subtitle>Sunrise and sunset</app-subtitle>
              </template>

              <img src="../../assets/img/icons/SunriseSunset.png" alt="Graph">

              <template #text>
                <div class="high-lights__wrapper">
                  <div class="high-lights__sunrise">
                    <icon-sunrise class="sunrise" />
                    <div class="">Sunrise</div>
                    <div class="high-lights__time">{{ sunriseTime }}</div>
                  </div>

                  <div class="high-lights__sunset">
                    <icon-sunset class="sunset" />
                    <div class="">Sunset</div>
                    <div class="high-lights__time">{{ sunsetTime }}</div>
                  </div>
                </div>
              </template>
            </high-lights-content>

            <high-lights-bottom>
              <template #title>
                <app-subtitle>Cloudiness</app-subtitle>
              </template>
              <template #text>
                {{ weatherInfo?.clouds?.all }} %
              </template>

              <template #row>
                <icon-cloud class="cloud" />
                <span>The sky fraction obscured by clouds</span>
              </template>
            </high-lights-bottom>
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