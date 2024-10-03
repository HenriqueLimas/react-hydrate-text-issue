import htmlescape from 'htmlescape';
import { renderToString } from 'react-dom/server'
import { createServer } from 'http';

const importmap = `{ "imports": { "react": "https://esm.sh/react@canary?dev", "react-dom/client": "https://esm.sh/react-dom@canary/client?dev" } }`
// No hydration error
// const inlintScript = ``

// 1. Prepending a an element with the same nodeType as one of the body children (ERROR)
const inlintScript = `<script>const div = document.createElement('div'); document.body.insertBefore(div, document.body.firstChild); </script>`

// 2. Prepending a text node (ERROR)
// const inlintScript = `<script> const textA = document.createTextNode(''); const textB = document.createTextNode(''); const div = document.createElement('div'); document.body.insertBefore(textB, document.body.firstChild); document.body.insertBefore(div, document.body.firstChild); document.body.insertBefore(textA, document.body.firstChild);</script>`

// 3. Add a className to the body (WARNING)
// const inlintScript = `<script>document.body.classList.add('class-name')</script>`

createServer(async function(req, res) {
  sendHTML(res, renderToString(
    <html>
      <body>
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: inlintScript }} />

        <div key="app" id="app">
          <h1>Hello World</h1>
          <button>Click Me</button>
        </div>

        <script type="importmap" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: importmap}} />
        <script type="module" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          import React from 'react'
          import { hydrateRoot } from 'react-dom/client'

          hydrateRoot(document.body, React.createElement('body', null, [
            React.createElement('div', { suppressHydrationWarning: true, dangerouslySetInnerHTML: {
              __html: ${htmlescape(inlintScript)}
            }}),
            React.createElement('div', { key: 'app', id: 'app' }, [
              React.createElement('h1', null, 'Hello World'),
              React.createElement('button', { onClick: () => console.log('Hello') }, 'Click Me'),
            ]),
            React.createElement('script', { type: 'importmap', suppressHydrationWarning: true, dangerouslySetInnerHTML: {
              __html: ${htmlescape(importmap)}
            }}),
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
