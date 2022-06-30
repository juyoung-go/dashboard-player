const { defineConfig } = require('@vue/cli-service')

const production = process.env.NODE_ENV === 'production'
module.exports = defineConfig({
  publicPath: production
    ? './'
    : '/',
  transpileDependencies: true
})
