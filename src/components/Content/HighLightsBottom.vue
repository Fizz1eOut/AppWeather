<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';

export default defineComponent({
  name: 'HighLightsBottom',

  components: {
    AppContainer,
    AppUnderlay,
}
});
</script>

<template>
  <div class="high-lights__bottom">
    <app-underlay>
      <app-container size="md">
        <div class="high-lights__content">
          <div class="title">
            <slot name="title" />
          </div>

        
          <div class="high-lights__text">
            <slot name="text" />
          </div>

          <div class="high-lights__row">
            <slot name="row" />
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style>
  .high-lights__bottom {
   height: auto; 
  }
  .high-lights__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 132px;
  }
  .high-lights__bottom> *:not(:last-child) {
    margin-bottom: 20px;
  }
  .high-lights__text {
    font-weight: 400;
    font-size: 25px;
    color: var(--color-black);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .high-lights__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
</style>