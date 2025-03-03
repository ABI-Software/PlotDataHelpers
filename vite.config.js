import path from 'path'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const config = {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern", "legacy"
        }
      }
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, './src/index.js'),
        name: 'PlotDataHelpers',
        fileName: 'plotdatahelpers'
      },
      build: {
        commonjsOptions: {transformMixedEsModules: true} // Change
      },
    }
  }

  return config
})
