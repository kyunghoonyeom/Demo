import * as Hands from "@mediapipe/hands";
import * as Camera from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useRecordWebcam, RecordWebcam } from "react-record-webcam";
import { useRef, useEffect } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Control from "./Control";

export default function MainScreen({
  level,
  setLevel,
  setIndex,
  progress,
  setProgress,
}) {
  const handRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const recordWebcam = useRecordWebcam();
  // if (recordWebcam) {
  //   setRecord({ start: recordWebcam.start });
  // }
  const onResults = (results) => {
    // const videoWidth = webcamRef.current.video.videoWidth;
    // const videoHeight = webcamRef.current.video.videoHeight;
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
      // typeof webcamRef.current !== "undefined" &&
      // webcamRef.current !== null
    ) {
      // webcamRef.current.crossOrigin = "anonymous";
      recordWebcam.webcamRef.current.crossOrigin = "anonymous";
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

  useEffect(() => {
    // if (recordWebcam) {
    //   if (recordWebcam.status === "CLOSED") {
    recordWebcam.open();
    init_hands();
    //   } else if (recordWebcam.status === "OPEN") {
    //     init_hands();
    //   }
    // }
    navigator.getUserMedia(
      { audio: true, video: true },
      (stream) => {
        stream.getTracks().forEach((x) => x.stop());
      },
      (err) => console.log(err)
    );
  }, []);

  return (
    <div>
      <p>Camera Status: {recordWebcam.status}</p>
      {/* <video ref={recordWebcam.webcamRef} autoPlay muted /> */}
      <Webcam ref={recordWebcam.webcamRef} hidden />
      <video ref={recordWebcam.previewRef} muted />
      {/* <Webcam ref={webcamRef} hidden /> */}
      {/* {recordWebcam.status === "INIT" && <canvas ref={canvasRef} />} */}
      {recordWebcam.status === "OPEN" && <canvas ref={canvasRef} />}
      <button onClick={init_hands}>init hands</button>
      <button onClick={recordWebcam.open}>open</button>
      <button onClick={recordWebcam.start}>start</button>
      <button onClick={recordWebcam.stop}>stop</button>
      <button onClick={recordWebcam.download}>download</button>
      {/* <Control
        setIndex={setIndex}
        progress={progress}
        setProgress={setProgress}
        level={level}
        setLevel={setLevel}
        start={recordWebcam.start}
        stop={recordWebcam.stop}
        download={recordWebcam.download}
      /> */}
    </div>
  );
}
