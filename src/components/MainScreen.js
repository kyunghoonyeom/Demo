import VideoRecorder from "react-video-recorder";

export default function MainScreen() {
  return (
    <VideoRecorder
      onRecordingComplete={(videoBlob) => {
        console.log(videoBlob);
      }}
    />
  );
}
