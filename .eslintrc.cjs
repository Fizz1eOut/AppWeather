/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/max-attributes-per-line': ['warn', {
      singleline: {max: 3}
    }],
    'vue/singleline-html-element-content-newline': ['off'],
    // 'eol-last': ['error', 'always'],
  }
}
