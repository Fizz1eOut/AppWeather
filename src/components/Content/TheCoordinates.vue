<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import AppTitle from '@/components/Base/AppTitle.vue';
import IconCompass from '@/components/Icons/IconCompass.vue';

export default defineComponent({
  name: 'TheCoordinates',

  components: {
    AppContainer,
    AppUnderlay,
    AppTitle,
    IconCompass
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
  <div class="coordinates">
    <app-underlay>
      <app-container size="lg">
        <div class="coordinates__body">
          <div class="coordinates__icon">
            <icon-compass class="compass" />
          </div>

          <div class="coordinates__content">
            <div class="coordinates__item">
              <app-title>
                Longitude: {{ weatherInfo?.coord?.lon }}
              </app-title>

              <p class="coordinates__text">
                Longitude measures distance east or west of the prime meridian.
              </p>
            </div>

            <div class="coordinates__item">
              <app-title>
                Latitude: {{ weatherInfo?.coord?.lat }}
              </app-title>

              <picture class="coordinates__text">
                Longitude measures distance east or west of the prime meridian.
              </picture>
            </div>
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .coordinates {
    width: 100%;
  }
  .coordinates__body {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .compass {
    width: 120px;
    height: 120px;
  }
  .coordinates__item:not(:last-child) {
    margin-bottom: 20px;
  }
  .coordinates__text {
    font-weight: 400;
    font-size: 18px;
  }
  @media (max-width: 440px) {
    .coordinates__body {
      flex-direction: column;
    }
  }
</style>