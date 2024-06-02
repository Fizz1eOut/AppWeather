<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import IconHumidity from '@/components/Icons/IconHumidity.vue';

export default defineComponent({
  name: 'TheHumidity',

  components: {
    AppContainer,
    AppUnderlay,
    AppTitle,
    IconHumidity
},

  props: {
    weatherInfo: {
      type: [Object, String, Number],
      default: null
    },
  }
});
</script>

<template>
  <div class="humidity">
    <app-underlay>
      <app-container size="lg">
        <div class="humidity__body">
          <div class="humidity__icon">
            <IconHumidity class="icon-humidity" />
          </div>

          <div class="humidity__content">
            <app-title>
              Humidity: {{ weatherInfo?.main.humidity }} %
            </app-title>

            <p class="humidity__text">
              Humidity is the concentration of water vapor present in the air. Water vapor, the gaseous state of water, is generally invisible to the human eye.
            </p>
            
            <p class="humidity__text">
              Humidity is the concentration of water vapor present in the air. Water vapor, the gaseous state of water, is generally invisible to the human eye.
            </p>
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .humidity__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .icon-humidity {
    width: 120px;
    height: 120px;
  }
  .humidity__text {
    font-weight: 400;
    font-size: 18px;
  }
  .humidity__text:not(:last-child) {
    margin-bottom: 10px;
  }
</style>