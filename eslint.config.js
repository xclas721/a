import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginCypress from 'eslint-plugin-cypress'

export default defineConfigWithVueTs(
  {
    ignores: [
      'node_modules/',
      'dist/',
      'dist-ssr/',
      'coverage/',
      '*.local',
      'cypress/videos/',
      'cypress/screenshots/',
      '.gitignore'
    ]
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ...eslintConfigPrettier,
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'off'
    }
  },
  // Align with old behavior: new @vue/eslint-config-typescript turns no-explicit-any on; relax for now
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ],
    ...pluginCypress.configs.recommended
  }
)
