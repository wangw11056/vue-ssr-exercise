import express from 'express'
// this runs in Node.js on the server.
import { createApp } from './app.js'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="module" src="./client.js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.use(express.static('./src'))

server.listen(3000, () => {
  console.log('ready')
})
