# React hydration error with Text Nodes

This repository is a minimal reproduction of a React hydration error that occurs when a Text Node is rendered in the body element by a 3rd party script outside of React.
This causes React to thrown an error when trying to hydrate the app and the app is not rendered and hydrated properly.

It is part of the hydration issue already reported [here](https://github.com/facebook/react/issues/24430).

```bash
git clone https://github.com/HenriqueLimas/react-hydrate-text-issue.git
npm install
npm start
```

Go to http://localhost:8080/ and open the console to see the error.
