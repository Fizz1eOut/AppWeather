<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppTitle',


});
</script>

<template>
  <h2 class="title">
    <slot />
  </h2>
</template>

<style scoped>
.title {
  font-family: "Nunito", sans-serif;
  font-weight: 400;
  font-size: 32px;
  color: var(--color-black);
  }  
@media (max-width: 499.98px) {
  .title {
    font-family: "Nunito", sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: var(--color-black);
  }  
}
</style>