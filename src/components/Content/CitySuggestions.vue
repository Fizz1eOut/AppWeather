<script>
import AppContainer from '@/components/Base/AppContainer.vue';
import AppUnderlay from '@/components/Base/AppUnderlay.vue';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'CitySuggestions',

  components: {
    AppUnderlay,
    AppContainer
},

  props: {
    filteredCities: {
        type: Array,
        default: () => []
    },
  },

  emits: ['select-city'],

  methods: {
    selectCity(city) {
      this.$emit('select-city', city);
    },
  },
})
</script>

<template>
  <div v-if="filteredCities.length > 0" class="city">
    <app-underlay>
      <app-container size="md">
        <ul class="city-list">
          <transition-group name="fade">
            <li
              v-for="filteredCity in filteredCities"
              :key="filteredCity.name"
              class="city-list__city"
              @click="selectCity(filteredCity)"
            >
              {{ filteredCity.name }}
            </li>
          </transition-group>
        </ul>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .city {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
  }
 .city-list {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .city-list__city {
    font-size: 20px;
    font-weight: 400;
    color: var(--color-black);
    cursor: pointer;
    text-decoration: underline;
  }
</style>