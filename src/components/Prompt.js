import data from "../assets/wordsToSign.json";

export default function Prompt({ level, setWord, progress, index }) {
  const wordList = data.words;
  setWord(wordList[index]);

  return (
    <div>
      <h1>{wordList[index]}</h1>
      <progress max={level * 2} value={progress}></progress>
    </div>
  );
}
