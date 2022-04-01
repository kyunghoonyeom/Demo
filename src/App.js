import { useRef, useState, useEffect } from "react";
import "./App.css";
import { Hands } from "@mediapipe/hands";
import MainScreen from "./components/MainScreen";
import VideoRecorder from "react-video-recorder";
import { Camera } from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

export default function App() {
  const hands = new Hands();
  const webcamRef = useRef(null);
  console.log(hands);
  return (
    <div className="App">
      React Webcam
      <Webcam ref={webcamRef} />
      <canvas />
    </div>
  );
}
