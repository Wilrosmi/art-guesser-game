import { useEffect, useState } from "react";
import { IPainting } from "./utils/types";
import getAPainting from "./utils/getAPainting";
import getRandomObjectId from "./utils/getRandomObjectId";

const placeholderPaintings: [IPainting, IPainting] = [
  {
    primaryImageSmall: "",
    objectEndDate: 0,
  },
  {
    primaryImageSmall: "",
    objectEndDate: 0,
  },
];

function App(): JSX.Element {
  const [artIds, setArtIds] = useState<number[]>([]);
  const [paintings, setPaintings] =
    useState<[IPainting, IPainting]>(placeholderPaintings);
  const [score, setScore] = useState<number>(0);
  const [page, setPage] = useState<0 | 1 | 2>(2);

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
          <h1>Newer or Older?</h1>
          <img src={paintings[0].primaryImageSmall} alt="Painting One" />
          <img src={paintings[1].primaryImageSmall} alt="Painting Two" />
          <p>Is the second piece of art older or newer than the first?</p>
          <button onClick={() => handleButtonChoice("older")}>older</button>
          <button onClick={() => handleButtonChoice("newer")}>newer</button>
          <p>{score}</p>
        </>
      )}

      {page === 2 && (
        <>
          <h1>Welcome to Newer or Older!</h1>
          <button onClick={handleStart}>Start Game</button>
        </>
      )}

      {page === 1 && (
        <>
          <h1>Newer or Older?</h1>
          <p>You got {score} correct</p>
          <button onClick={playAgain}>Play Again</button>
        </>
      )}
    </div>
  );
}

export default App;
