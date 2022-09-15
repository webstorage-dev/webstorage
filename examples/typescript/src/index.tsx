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

function App() {
  const [val, setVal] = useState("");
  const [language, setLanguage] = useAppStorage("language");
  const [count, setCount] = useAppStorage("count");

  return (
    <WebStorage account="tatetest" store="123">
      <h1>WebStorage Example</h1>
      <div>
        <p>Key: language</p>
        <p>Value: {language}</p>
        <p>Key: count</p>
        <p>Value: {count}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLanguage(val);
            setCount(count + 1);
          }}
        >
          <input
            value={val}
            onChange={(e) => setVal(e.currentTarget.value)}
          ></input>
        </form>
      </div>
    </WebStorage>
  );
}

const root = createRoot(document.getElementById("app") as Element);
root.render(<App />);
