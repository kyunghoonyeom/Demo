import * as Hands from "@mediapipe/hands";
import * as Camera from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useRecordWebcam, CAMERA_STATUS } from "react-record-webcam";
import { useState, useRef, useEffect } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Control from "./Control";
import "./MainScreen.css";

export default function MainScreen({
  level,
  setLevel,
  setIndex,
  progress,
  setProgress,
  word,
}) {
  const [landmark, setLandmark] = useState([]);
  const handRef = useRef(null);
  const canvasRef = useRef(null);
  const recordWebcam = useRecordWebcam();

  const processResult = (results, save) => {
    const videoWidth = recordWebcam.webcamRef.current.video.videoWidth;
    const videoHeight = recordWebcam.webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiHandLandmarks) {
      if (save) {
        setLandmark((arr) => [...arr, results.multiHandLandmarks]);
      }
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };
  const onResults = (results) => {
    processResult(results, false);
  };

  const onResultSave = (results) => {
    processResult(results, true);
  };
  const init_hands = () => {
    const hands = new Hands.Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    handRef.current = hands;
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);
    if (
      typeof recordWebcam.webcamRef.current !== "undefined" &&
      recordWebcam.webcamRef.current !== null
    ) {
      recordWebcam.webcamRef.current.crossOrigin = "anonymous";

      console.log(recordWebcam.webcamRef.current);
      const camera = new Camera.Camera(recordWebcam.webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: recordWebcam.webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  };

  // Component did mount
  useEffect(() => {
    recordWebcam.open();
    init_hands();

    navigator.mediaDevices.getUserMedia(
      { audio: true, video: true },
      (stream) => {
        stream.getTracks().forEach((x) => x.stop());
      },
      (err) => console.log(err)
    );
  }, []);

  // Component update
  useEffect(() => {
    handRef.current.onResults(
      recordWebcam.status === CAMERA_STATUS.RECORDING ? onResultSave : onResults
    );
  }, [recordWebcam.status]);

  return (
    <div className="container">
      <div className="screen-wrapper">
        <Webcam ref={recordWebcam.webcamRef} hidden />
        <video
          ref={recordWebcam.previewRef}
          muted
          controls
          hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
        />
        <div
          className="canvas-cta"
          hidden={
            recordWebcam.status !== CAMERA_STATUS.OPEN &&
            recordWebcam.status !== CAMERA_STATUS.RECORDING
          }
        >
          <canvas ref={canvasRef} />
          <div
            className="circle"
            style={{
              display:
                recordWebcam.status === CAMERA_STATUS.RECORDING
                  ? "block"
                  : "none",
            }}
          />
        </div>
      </div>

      <Control
        setIndex={setIndex}
        progress={progress}
        setProgress={setProgress}
        level={level}
        setLevel={setLevel}
        setLandmark={setLandmark}
        landmark={landmark}
        word={word}
        recordWebcam={recordWebcam}
      />
    </div>
  );
}
