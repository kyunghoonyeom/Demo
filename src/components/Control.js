import data from "../assets/wordsToSign.json";
import { CAMERA_STATUS } from "react-record-webcam";
export default function Control({
  level,
  setLevel,
  setIndex,
  progress,
  setProgress,
  setLandmark,
  landmark,
  word,
  recordWebcam,
}) {
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * data.words.length);
    if (progress + 1 === level * 2) {
      setLevel(level + 1);
      setProgress(0);
    } else {
      setProgress(progress + 1);
    }
    setIndex(randomIndex);
  };

  const handleDownload = async () => {
    const blob = await recordWebcam.getRecording();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(landmark)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${word}_${progress.toString()}.json`;
    link.click();
    var videoUrl = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = videoUrl;
    tempLink.download = `${word}_${progress.toString()}_video.mp4`;
    tempLink.click();
    recordWebcam.retake();
    handleClick();

    setLandmark([]);
  };

  const handleStop = () => {
    recordWebcam.stop();
  };

  return (
    <div>
      <button
        hidden={recordWebcam.status !== CAMERA_STATUS.OPEN}
        onClick={recordWebcam.start}
      >
        START RECORDING
      </button>
      <button
        hidden={recordWebcam.status !== CAMERA_STATUS.RECORDING}
        onClick={handleStop}
      >
        STOP RECORDING
      </button>
      <button
        hidden={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
        onClick={handleDownload}
      >
        DOWNLOAD DATA
      </button>
    </div>
  );
}
