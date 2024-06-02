<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppInput',

  props: {
    placeholder: {
      type: String,
      required: true,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },

  emits: ['update:modelValue'],

  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    },
  },
});
</script>

<template>
  <div>
    <input 
      v-model="inputValue"
      type="text" 
      class="input" 
      :placeholder="placeholder"
    >
    <label for="#" class="label" />
  </div>
</template>

<style scoped>
.input {
  border-radius: 30px;
  outline: none;
  width: 100%;
  padding: 8px 30px;
  font-size: 32px;
  font-weight: 400;
  background-color: var(--color-transparent-white);
  color: var(--color-black);
}
::-webkit-input-placeholder {
   color: var(--color-black);
  }
  :-moz-placeholder { 
    color: var(--color-black);
  }
  ::-moz-placeholder { 
    color: var(--color-black);
  }
  :-ms-input-placeholder {
    color: var(--color-black);
  }
  @media (max-width: 360px) {
    .input {
      padding: 8px 12px;
    }
  } 
</style>