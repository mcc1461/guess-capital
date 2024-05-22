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
  const [results, setResults] = useState<{ round: number; score: number }[]>(
    []
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    startNewRound(); // Initialize the first round
  }, []);

  function startNewRound() {
    if (round > 5) {
      setGameOver(true);
      setGameOverMessage("Game Over!");
      return;
    }
    // setRound(round + 1); // Increment the round

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
    setShowAnswer(false); // Hide the answer for the new round
    setCorrectAnswer(null); // Reset correct answer for the new round
    setIsDisabled(false); // Re-enable selections for the new round
    setAlertMessage(null); // Clear any alert messages
  }

  function handleCheck() {
    if (gameOver || isDisabled) return; // Prevent further actions if the game is over or the round is finished

    let roundScore = 0;

    if (capital1.length === 0 && capital2 === undefined) {
      setAlertMessage("Please select a method of selection.");
      return;
    }

    if (!isSingleActive && capital1.length !== 2) {
      setAlertMessage(
        "Please select exactly 2 capitals for multiple selection."
      );
      return;
    }

    if (isSingleActive) {
      if (capital2?.capital === asked?.capital) {
        roundScore = 100;
      }
    } else {
      const correctAnswers = capital1.filter(
        (c) => c.capital === asked?.capital
      );
      if (correctAnswers.length === 1 && capital1.length === 2) {
        roundScore = 70;
      }
    }
    {setRound(round + 1)}; // Increment the round

    setScore(score + roundScore);
    setResults([...results, { round, score: roundScore }]);
    setShowAnswer(true); // Show the answer
    setCorrectAnswer(asked?.capital || null); // Set the correct answer
    setIsDisabled(true); // Disable selections after checking
    setAlertMessage(null); // Clear any alert messages
  }

  function resetGame() {
    setScore(0);
    setRound(1);
    setResults([]);
    setGameOver(false);
    setGameOverMessage("");
    startNewRound();
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
      <div className={styles.alerts}>
        {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
      </div>
      <div className={styles["asked-country"]}>{asked.country}</div>
      <h3 className={styles["asked-capital-group"]}>
        <span className={styles["answer-text"]}>Answer:</span>
        {showAnswer && (
          <span className={styles["answer-capital"]}>{correctAnswer}</span>
        )}
      </h3>
      <h2 className={styles["mcc-multiple"]}>
        Multiple ~ Selection <span className={styles.points}>(70 points)</span>
      </h2>
      <Select
        multiple
        asked={capital1}
        choiceGroup={choiceGroup}
        onChange={(o) => {
          if (!isDisabled) {
            setCapital1(o);
            setCapital2(undefined); // Clear single selection
            setIsSingleActive(false);
            console.log(o);
          }
        }}
        options={options}
      />
      <h2 className={styles["mcc-single"]}>
        Single ~ Selection <span className={styles.points}>(100 points)</span>
      </h2>
      <Select
        asked={capital2}
        choiceGroup={choiceGroup}
        onChange={(o) => {
          if (!isDisabled) {
            setCapital2(o);
            setCapital1([]); // Clear multiple selection
            setIsSingleActive(true);
            console.log(o);
          }
        }}
        options={options}
      />
      <div className={styles["button-block"]}>
        <button
          className={styles["check-btn"]}
          onClick={handleCheck}
          disabled={gameOver || isDisabled}
        >
          Check
        </button>{" "}
        {/* Disable button when game is over or round is finished */}
        
       
          <button
            className={styles["next-round"]}
            onClick={startNewRound}
            style={{ visibility: showAnswer && !gameOver ? "visible" : 'hidden' }}

            disabled={gameOver}
          >
            Next Round
          </button>
        <button onClick={resetGame} className={styles["new-game-button"]}>
          New Game
        </button>
      </div>

      <h4 className={styles.round}>Round: {round >= 5 ? 5 : round}/5</h4>
      <h3 className={styles.score}>Score: {score}</h3>
      {gameOver && (
        <div className={styles.finish}>
          <h2>{gameOverMessage}</h2>
          <h3>Final Score: {score}</h3>
          {/* <h3>Results</h3>
          <ul>
            {results.map((result) => (
              <li key={result.round}>
                Round {result.round}: {result.score} points
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </>
  );
}

export default App;
