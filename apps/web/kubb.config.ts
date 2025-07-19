/** biome-ignore-all lint/style/useNamingConvention: kubb variable */

import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { env } from '@repo/env'

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
    pluginTs(),
    pluginOas(),
    pluginReactQuery({
      parser: 'client',
      client: {
        baseURL: `http://localhost:${env.API_PORT}`,
      },
      suspense: false,
    }),
  ],
})
