import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * ESLint Configuration
 * Defines the coding standards and error checking rules for the project.
 * Uses recommended settings for React, TypeScript, and Vite.
 */
export default defineConfig([
  // Ignore the build output directory
  globalIgnores(['dist']),
  {
    // Apply these rules to TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Enable browser global variables (window, document, etc.)
    },
  },
])
