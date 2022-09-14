import { useEffect, useState } from "react";
import { IPainting } from "./utils/types";
import getAPainting from "./utils/getAPainting";
import getRandomObjectId from "./utils/getRandomObjectId";

const placeholderPaintings: [IPainting, IPainting] = [
  {
    primaryImageSmall: "",
    objectEndDate: 0,
    title: "",
  },
  {
    primaryImageSmall: "",
    objectEndDate: 0,
    title: "",
  },
];

function App(): JSX.Element {
  const [artIds, setArtIds] = useState<number[]>([]);
  const [paintings, setPaintings] =
    useState<[IPainting, IPainting]>(placeholderPaintings);
  const [score, setScore] = useState<number>(0);
  const [page, setPage] = useState<0 | 1 | 2>(2);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    const getIds = async (): Promise<void> => {
      const response = await fetch(
        "https://collectionapi.metmuseum.org/public/collection/v1/objects"
      );
      const ids: number[] = (await response.json()).objectIDs;
      setArtIds(ids);
    };
    getIds();
  }, []);

  useEffect(() => {
    const getPainting = async (): Promise<void> => {
      const paintingOne = await getAPainting(getRandomObjectId(artIds));
      const paintingTwo = await getAPainting(getRandomObjectId(artIds));
      setPaintings([paintingOne, paintingTwo]);
    };
    if (artIds.length !== 0) {
      getPainting();
    }
  }, [artIds, page]);

  useEffect(() => {
    const paintingsCopy: [IPainting, IPainting] = [...paintings];
    let hasAPaintingChanged = false;
    const emptyImageChecker = async (): Promise<void> => {
      for (let i = 0; i <= 1; i++) {
        if (paintings[i].primaryImageSmall === "") {
          const newPainting = await getAPainting(getRandomObjectId(artIds));
          paintingsCopy[i] = newPainting;
          hasAPaintingChanged = true;
        }
      }
      if (hasAPaintingChanged) {
        setPaintings(paintingsCopy);
      }
    };
    if (artIds.length !== 0) {
      emptyImageChecker();
    }
  }, [paintings, artIds]);

  async function handleButtonChoice(pick: "older" | "newer"): Promise<void> {
    const correctAnswer =
      paintings[0].objectEndDate > paintings[1].objectEndDate
        ? "older"
        : "newer";
    if (pick === correctAnswer) {
      const newPainting = await getAPainting(getRandomObjectId(artIds));
      const newPaintings: [IPainting, IPainting] = [paintings[1], newPainting];
      setPaintings(newPaintings);
      setScore((sc) => sc + 1);
    } else {
      setPage(1);
    }
  }

  function playAgain(): void {
    setScore(0);
    setPage(0);
  }

  function handleStart(): void {
    setPage(0);
  }

  return (
    <div>
      {page === 0 && (
        <>
          <div className="top-line">
            <p className="main-score">score: {score}</p>
            <h1 className="main-title">Newer or Older?</h1>
            <p className="high-score">high score: {highScore}</p>
          </div>
          <div className="paintings">
            <img
              className="left painting"
              src={paintings[0].primaryImageSmall}
              alt="Painting One"
            />
            <img
              className="right painting"
              src={paintings[1].primaryImageSmall}
              alt="Painting Two"
            />
          </div>
          <div className="prompt-grid">
            <p className="left-prompt">
              "{paintings[0].title}" was made in {paintings[0].objectEndDate}
            </p>
            <p className="right-prompt">"{paintings[1].title}" is</p>
            <p className="right-prompt-btns">
              <button
                className="older-btn"
                onClick={() => handleButtonChoice("older")}
              >
                older?
              </button>{" "}
              or{" "}
              <button
                className="newer-btn"
                onClick={() => handleButtonChoice("newer")}
              >
                newer?
              </button>
            </p>
          </div>
        </>
      )}

      {page === 2 && (
        <>
          <h1 className="home-title">Newer or Older!</h1>
          <p className="home-subtitle">
            Try to figure out which artifact of two was created first
          </p>
          <button className="home-btn" onClick={handleStart}>
            Start Game
          </button>
        </>
      )}

      {page === 1 && (
        <>
          <h1 className="loss-title">Newer or Older?</h1>
          <h3 className="loss-score">You got {score} correct</h3>
          <button className="loss-btn" onClick={playAgain}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

export default App;
