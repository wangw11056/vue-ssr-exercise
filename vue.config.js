// const { defineConfig } = require('@vue/cli-service')
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const serverConfig = require('./vue.server.config')

if (TARGET_NODE) {
  module.exports = serverConfig
} else {
  module.exports = {
    transpileDependencies: true,
  }
}
