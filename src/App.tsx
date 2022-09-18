import { useEffect, useState } from "react";
import { IPainting } from "./utils/types";
import getAPainting from "./utils/getAPainting";
import formatDate from "./utils/formatDate";

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
    const getTwoPaintingsWithImages = async (): Promise<void> => {
      const paintingOne = await getAPainting(artIds);
      const paintingTwo = await getAPainting(artIds);
      setPaintings([paintingOne, paintingTwo]);
    };
    if (artIds.length !== 0 && page === 0) {
      getTwoPaintingsWithImages();
    }
  }, [artIds, page]);

  async function handleButtonChoice(pick: "older" | "newer"): Promise<void> {
    const correctAnswer =
      paintings[0].objectEndDate > paintings[1].objectEndDate
        ? "older"
        : "newer";
    if (pick === correctAnswer) {
      const newPainting = await getAPainting(artIds);
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
      {page === 0 && paintings[0].primaryImageSmall !== "" && (
        <>
          <div className="top-line">
            <p className="main-score">score: {score}</p>
            <h1 className="main-title">Older or Newer?</h1>
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
              "{paintings[0].title}" was made in{" "}
              {formatDate(paintings[0].objectEndDate)}
            </p>
            <p className="right-prompt">"{paintings[1].title}" is</p>
            <p className="right-prompt-btns">
              <button
                className="guess btn"
                onClick={() => handleButtonChoice("older")}
              >
                older?
              </button>{" "}
              or{" "}
              <button
                className="guess btn"
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
          <h1 className="home-title">Older or Newer?</h1>
          <p className="home-subtitle">
            Try to figure out which artifact of two was created first
          </p>
          <button className="start btn" onClick={handleStart}>
            Start Game
          </button>
        </>
      )}

      {page === 1 && (
        <>
          <h1 className="loss-title">Older or Newer?</h1>
          <h3 className="loss-score">You got {score} correct</h3>
          <button className="replay btn" onClick={playAgain}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

export default App;
