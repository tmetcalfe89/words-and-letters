import "./style.scss";
import { useCallback, useMemo, useState } from "react";
import { useClipboard, useSetState } from "rooks";
import classNames from "classnames";

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export default function App() {
  const [words, wordControls] = useSetState(new Set());
  const [newWord, setNewWord] = useState("");
  const [focusedWord, setFocusedWord] = useState();
  const [focusedLetter, setFocusedLetter] = useState();
  const { copy } = useClipboard();
  const [wordLength, setWordLength] = useState(0);

  const addWord = useCallback(
    (evt) => {
      evt.preventDefault();
      newWord
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .forEach((word) => wordControls.add(word));
      setNewWord("");
    },
    [newWord, wordControls],
  );

  const wordsList = useMemo(() => Array.from(words).sort(), [words]);

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <strong>Words and Letters</strong>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <nav>
            <ul>
              <li>
                <h1>Letters</h1>
              </li>
            </ul>
          </nav>
          <div className="grid">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={classNames({
                  secondary: Array.from(words).some((word) =>
                    word.includes(letter),
                  ),
                  outline: focusedWord?.includes(letter) ?? false,
                })}
                onMouseOver={() => setFocusedLetter(letter)}
                onMouseLeave={() => setFocusedLetter()}
              >
                {letter} ({wordsList.filter((e) => e.includes(letter)).length})
              </button>
            ))}
          </div>
        </section>
        <section>
          <nav>
            <ul>
              <li>
                <h1>Words</h1>
              </li>
            </ul>
            <ul>
              <li>
                <input
                  value={wordLength}
                  onChange={(e) => setWordLength(e.target.value)}
                />
              </li>
              <li>
                <button onClick={() => copy([...wordsList].sort().join(", "))}>
                  Copy
                </button>
              </li>
            </ul>
          </nav>
          <form onSubmit={addWord}>
            <fieldset role="group">
              <input
                name="word"
                placeholder="Give me your words."
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <input type="submit" value="Add" />
            </fieldset>
          </form>
          <div className="grid">
            {wordsList.length > 0 ? (
              wordsList.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    wordControls.delete(word);
                    setFocusedWord();
                  }}
                  onMouseOver={() => setFocusedWord(word)}
                  onMouseLeave={() => setFocusedWord()}
                  className={classNames({
                    secondary: word.length != wordLength && wordLength > 0,
                    outline: word.includes(focusedLetter)
                  })}
                >
                  {word}
                </button>
              ))
            ) : (
              <div>No words yet.</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
