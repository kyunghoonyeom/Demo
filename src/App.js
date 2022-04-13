import { useRef, useState, useEffect } from "react";
import "./App.css";
import { useRecordWebcam } from "react-record-webcam";
import Control from "./components/Control";
import MainScreen from "./components/MainScreen";
import Prompt from "./components/Prompt";

export default function App() {
  const [word, setWord] = useState("");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [record, setRecord] = useState();

  return (
    <div className="App">
      <Prompt
        level={level}
        progress={progress}
        setWord={setWord}
        index={index}
      />
      <MainScreen
        setIndex={setIndex}
        progress={progress}
        setProgress={setProgress}
        level={level}
        setLevel={setLevel}
      />
    </div>
  );
}
