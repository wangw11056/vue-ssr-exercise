const express = require('express')
const fs = require('fs')
const path = require('path')
const host = 'localhost'
const port = 8080
const resolve = (p) => path.resolve(__dirname, p)

async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  const server = express()
  let vite
  if (!isProd) {
    let { createServer: _createServer } = require('vite')
    vite = await _createServer({
      root,
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
    })
    server.use(vite.middlewares)
  }
  server.use('*', async (req, res) => {
    const { originalUrl: url } = req
    console.log(`[server] ${new Date()} - ${url}`)
    try {
      let template, render
      if (!isProd) {
        // 读取模版
        template = fs.readFileSync(resolve('../../public/index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/server/entry.js')).render
      }

      let { html } = await render()
      // 替换模版中的标记
      html = template.replace('<!--app-html-->', html)
      // 响应
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error('[error]', e.stack)
      res.status(500).end(e.stack)
    }
  })
  server.use(express.static('.'))
  return { server }
}

createServer().then(({ server }) => {
  server.listen(port, () => {
    console.log('\nApp running at:')
    console.log(`- Local:  http://${host}:${port}/`)
  })
})
