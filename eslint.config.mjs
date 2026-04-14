import electronToolkit from '@electron-toolkit/eslint-config-ts'
import reactPlugin from 'eslint-plugin-react'

const { configs, config } = electronToolkit

export default config(
  { ignores: ['out/**', 'dist/**', 'node_modules/**'] },
  ...configs.recommended,
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
    settings: {
      react: { version: 'detect' }
    }
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
)
