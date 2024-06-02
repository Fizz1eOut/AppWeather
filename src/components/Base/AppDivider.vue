<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDivider',
});
</script>

<template>
  <div class="divider" />
</template>

<style scoped>
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-black);
}
</style>