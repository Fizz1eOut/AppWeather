<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppUnderlay',

});
</script>

<template>
  <div class="underlay">
    <slot />
  </div>
</template>

<style scoped>
  .underlay {
    background: var(--color-transparent-white);
    backdrop-filter: blur(4px);
    border-radius: 40px;
  }
</style>
