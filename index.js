import htmlescape from 'htmlescape';
import { renderToString } from 'react-dom/server'
import { createServer } from 'http';

const importmap = `{ "imports": { "react": "https://esm.sh/react@canary", "react-dom/client": "https://esm.sh/react-dom@canary/client" } }`
// const inlintScript = ``
// const inlintScript = `<script type="module">const div = document.createElement('div'); document.body.insertBefore(div, document.body.firstChild); </script>`
const inlintScript = `<script type="module"> const textA = document.createTextNode(''); const textB = document.createTextNode(''); const div = document.createElement('div'); document.body.insertBefore(textB, document.body.firstChild); document.body.insertBefore(div, document.body.firstChild); document.body.insertBefore(textA, document.body.firstChild);</script>`

createServer(async function(req, res) {
  sendHTML(res, renderToString(
    <html>
      <body>
        <script type="importmap" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: importmap}} />
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: inlintScript }} />

        <div id="app">
          <h1>Hello World</h1>
          <button>Click Me</button>
        </div>

          <script type="module" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
            import React from 'react'
            import { hydrateRoot } from 'react-dom/client'

            hydrateRoot(document.body, React.createElement('body', null, [
              React.createElement('script', { type: 'importmap', suppressHydrationWarning: true, dangerouslySetInnerHTML: {
                __html: ${htmlescape(importmap)}
              }}),
              React.createElement('div', { suppressHydrationWarning: true, dangerouslySetInnerHTML: {
                __html: ${htmlescape(inlintScript)}
              }}),
              React.createElement('div', { id: 'app' }, [
                React.createElement('h1', null, 'Hello World'),
                React.createElement('button', { onClick: () => console.log('Hello') }, 'Click Me'),
              ]),
              React.createElement('script', { type: 'module', suppressHydrationWarning: true, dangerouslySetInnerHTML: { __html: '' } })
            ]))
          ` }} />
      </body>
    </html>
  ))
}).listen(8080)

function sendHTML(res, html) {
  res.setHeader('Content-Type', 'text/html')
  res.write('<!DOCTYPE html>')
  res.end(html)
}
