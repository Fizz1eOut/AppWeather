<script>
import { defineComponent } from 'vue';
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';

export default defineComponent({
  name: 'HighLightsContent',

  components: {
    AppContainer,
    AppUnderlay,
}
});
</script>

<template>
  <div class="high-lights__group">
    <app-underlay>
      <app-container size="md">
        <div class="high-lights__content">
          <div class="title">
            <slot name="title" />
          </div>

          
          <div class="graph">
            <slot />
          </div>

          <div class="high-lights__text">
            <slot name="text" />
          </div>
        </div>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .high-lights__group {
    height: auto;
    text-align: center;
  }
  .high-lights__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: auto;
  }
  .high-lights__group:not(:last-child) {
    margin-bottom: 20px;
  }
  .high-lights__text {
    font-weight: 400;
    font-size: 25px;
    color: var(--color-black);
    justify-content: center;
  }
  .high-lights__text> *:not(:last-child) {
    margin-right: 10px;
  }
</style>