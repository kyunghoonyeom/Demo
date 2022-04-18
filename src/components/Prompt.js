import data from "../assets/wordsToSign.json";

export default function Prompt({ level, setWord, progress, index }) {
  const wordList = data.words;
  let myString = wordList[index]
  myString.replace(/^\w/, (c) => c.toUpperCase());
  setWord(myString);

  return (
    <div className='rowC'>
      <h1 >{wordList[index]}</h1>
      <progress max={level * 2} value={progress}></progress>
    </div>
  );
}
