import React, { useState, useEffect } from "react";
import Select, { SelectOption } from "./Select";
import styles from "./app.module.css";
import data from "./assets/data";

function App() {
  const options = data();
  const [capital1, setCapital1] = useState<SelectOption[]>([]);
  const [capital2, setCapital2] = useState<SelectOption | undefined>(undefined);
  const [isSingleActive, setIsSingleActive] = useState(true);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState<SelectOption | null>(null);
  const [choiceGroup, setChoiceGroup] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [results, setResults] = useState<{ round: number; score: number }[]>([]);


  useEffect(() => {
    startNewRound(); // Initialize the first round
  }, []);

  function startNewRound() {
    const randomNo = Math.floor(Math.random() * options.length);
    setAsked(options[randomNo]);

    const groupCapitals = options.map((option) => option.capital);
    const restCapitals = groupCapitals.filter(
      (capital) => capital !== options[randomNo].capital
    );
    const getRandomSubset = (restCapitals: string[]): string[] => {
      const shuffled = restCapitals.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    };
    setChoiceGroup(
      [options[randomNo].capital, ...getRandomSubset(restCapitals)].sort(
        () => Math.random() - 0.5
      )
    );
    setCapital1([]); // Reset multiple selection
    setCapital2(undefined); // Reset single selection
  }
  

  function handleCheck() {
    if (gameOver) return; // Prevent further actions if the game is over

    let roundScore = 0;
    if (isSingleActive) {
      if (capital2?.capital === asked?.capital) {
        roundScore = 100;
      }
    } else {
      const correctAnswers = capital1.filter((c) => c.capital === asked?.capital);
      if (correctAnswers.length === 1 && capital1.length === 1) {
        roundScore = 100;
      } else if (correctAnswers.length === 1 && capital1.length === 2) {
        roundScore = 50;
      } else if (correctAnswers.length === 1 && capital1.length === 3) {
        roundScore = 20;
      }
    }

    setScore((prevScore) => prevScore + roundScore); // Correctly update score
    setResults([...results, { round, score: roundScore }]); // Store the result for the round

    if (round < 5) { 
      setRound(round + 1); // Move to the next round
      startNewRound(); // Initialize new round
    } else {
      setGameOver(true); // End the game
      setGameOverMessage("Game Over!");
      setIsSingleActive(false); // Disable further selections
    }
  }

  if (!asked) {
    return <div>Loading...</div>; // Show a loading state until asked is set
  }

  return (
    <>
      <h1 className={styles.mcc}>Guess Capital</h1>
      <h3 className={styles["guess-text"]}>
        Find the capital of the following country...
      </h3>
      <div className={styles["asked-country"]}>{asked.country}</div>

      <h2 className={styles["mcc-multiple"]}>Multiple ~ Selection</h2>
      <Select
        multiple
        asked={capital1}
        choiceGroup={choiceGroup}
        onChange={(o) => {
          setCapital1(o);
          setCapital2(undefined); // Reset single selection
          setIsSingleActive(false);
          console.log(o);
        }}
        options={options}
      />

      <h2 className={styles["mcc-single"]}>Single ~ Selection</h2>
      <Select
        asked={capital2}
        choiceGroup={choiceGroup}
        onChange={(o) => {
          setCapital2(o);
          setCapital1([]); // Reset multiple selection
          setIsSingleActive(true);
          console.log(o);
        }}
        options={options}
      />

      <button onClick={handleCheck} disabled={gameOver}>Check</button> {/* Disable button when game is over */}
      <h3>Score: {score}</h3>
      <h4>Round: {round}/5</h4>

      {gameOver && (
        <div>
          <h1>{gameOverMessage}</h1>
          <h2>Final Score: {score}</h2>
          <h3>Results</h3>
          <ul>
            {results.map((result) => (
              <li key={result.round}>
                Round {result.round}: {result.score} points
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
