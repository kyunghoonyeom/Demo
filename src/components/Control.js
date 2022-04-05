import data from "../assets/wordsToSign.json";

export default function Control({
  level,
  setLevel,
  setIndex,
  progress,
  setProgress,
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

  return (
    <div>
      <button onClick={handleClick}>Go</button>
    </div>
  );
}
