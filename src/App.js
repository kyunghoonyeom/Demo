import { useState } from "react";
import "./App.css";
import MainScreen from "./components/MainScreen";
import Prompt from "./components/Prompt";

export default function App() {
  const [word, setWord] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(5);

  return (
    <div className="App">
      <div>
      <MainScreen
        word={word}
        setIndex={setIndex}
        progress={progress}
        setProgress={setProgress}
        level={level}
        setLevel={setLevel}
        setWord={setWord}
        index={index}
      />
      </div>

    </div>
  );
}
