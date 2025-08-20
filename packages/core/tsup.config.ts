import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    database: 'src/database/index.ts',
    types: 'src/types/index.ts',
    validations: 'src/validations/index.ts',
    utils: 'src/utils/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['@supabase/supabase-js']
})
