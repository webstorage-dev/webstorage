# WebStorage

<blockquote>LocalStorage synced to the cloud</blockquote>

<br />

<a href="https://www.npmjs.com/package/webstorage">
  <img src="https://img.shields.io/npm/v/webstorage.svg">
</a>
<a href="https://github.com/webstorage-dev/webstorage/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/webstorage.svg">
</a>
<a href="https://bundlephobia.com/result?p=webstorage">
  <img src="https://img.shields.io/bundlephobia/minzip/webstorage">
</a>
<a href="https://www.npmjs.com/package/webstorage">
  <img src="https://img.shields.io/npm/dy/webstorage.svg">
</a>
<a href="https://github.com/webstorage-dev/webstorage/actions/workflows/ci.yml">
  <img src="https://github.com/webstorage-dev/webstorage/actions/workflows/ci.yml/badge.svg">
</a>
<a href="https://codecov.io/gh/webstorage-dev/webstorage">
  <img src="https://img.shields.io/codecov/c/github/webstorage-dev/webstorage/main.svg?style=flat-square">
</a>

## What is this? 🧐

Coming Soon!

## Installation & Usage 📦

1. Add this package to your project:
   - `npm install @webstorage-dev/webstorage` or `yarn add @webstorage-dev/webstorage`

## Highlights

Coming Soon!

## Examples 🚀

### React

```tsx
import { createRoot } from "react-dom/client";
import {
  WebStorage,
  useWebStorage,
  UseWebStorage,
} from "@webstorage/webstorage/adapters/react";
import { useState } from "react";

type Storage = {
  language: string;
  count: number;
};

const useAppStorage = useWebStorage as UseWebStorage<Storage>;

function Main() {
  const [val, setVal] = useState("");
  const [language, setLanguage] = useAppStorage("language");
  const [count, setCount] = useAppStorage("count");

  return (
    <div>
      <p>Key: language</p>
      <p>Value: {language}</p>
      <p>Key: count</p>
      <p>Value: {count}</p>
      <form
        onSubmit={(e) => {
          setLanguage(val);
          setCount(count + 1);
          e.preventDefault();
        }}
      >
        <input
          value={val}
          onChange={(e) => setVal(e.currentTarget.value)}
        ></input>
      </form>
    </div>
  );
}

function App() {
  return (
    <WebStorage account="tatetest" store="123">
      <h1>WebStorage Example</h1>
      <Main />
    </WebStorage>
  );
}

const root = createRoot(document.getElementById("app") as Element);
root.render(<App />);
```

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/webstorage-dev/webstorage/blob/main/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/webstorage-dev/webstorage/blob/main/LICENSE).
