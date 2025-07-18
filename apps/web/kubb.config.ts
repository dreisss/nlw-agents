import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: '../api/docs.json',
  },
  output: {
    path: './src/kubb',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginReactQuery({ parser: 'zod' }),
    pluginTs(),
    pluginZod(),
  ],
})
