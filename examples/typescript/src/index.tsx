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
