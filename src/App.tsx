import {useEffect, useState} from "react";
import {IPainting} from "./utils/types";
import getAPainting from "./utils/getAPainting";
import getRandomObjectId from "./utils/getRandomObjectId";

const placeholderPaintings: [IPainting, IPainting] = [
  {
    primaryImageSmall: "",
    objectEndDate: 0
  },
  {
    primaryImageSmall: "",
    objectEndDate: 0
  }
]

function App(): JSX.Element {
  const [artIds, setArtIds] = useState<number[]>([]);
  const [paintings, setPaintings] = useState<[IPainting, IPainting]>(placeholderPaintings);
  const [score, setScore] = useState<number>(0);
  const [lost, setLost] = useState<0 | 1>(0);

  useEffect(() => {
    const getIds = async (): Promise<void> => {
      const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects");
      const ids: number[] = (await response.json()).objectIDs;
      setArtIds(ids);
    }
    getIds();
  }, []);

  useEffect(() => {
    const getPainting = async (): Promise<void> => {
      const paintingOne = await getAPainting(getRandomObjectId(artIds));
      const paintingTwo = await getAPainting(getRandomObjectId(artIds));
      setPaintings([paintingOne, paintingTwo]);
    }
    if (artIds.length !== 0) {
      getPainting();
    }
  }, [artIds, lost]);

  useEffect(() => {
    const paintingsCopy: [IPainting, IPainting] = [...paintings];
    const emptyImageChecker = async (): Promise<void> => {
      for (let i = 0; i <= 1; i++) {
        if (paintings[i].primaryImageSmall === "") {
          const newPainting = await getAPainting(getRandomObjectId(artIds));
          paintingsCopy[i] = newPainting;
        }
      }
      setPaintings(paintingsCopy);
    }
    emptyImageChecker();
  }, [...paintings]);

  async function handleButtonChoice(pick: "older" | "newer"): Promise<void> {
    const correctAnswer = paintings[0].objectEndDate > paintings[1].objectEndDate ? "older" : "newer";
    if (pick === correctAnswer) {
      const newPainting = await getAPainting(getRandomObjectId(artIds));
      const newPaintings: [IPainting, IPainting] = [paintings[1], newPainting];
      setPaintings(newPaintings);
      setScore(sc => sc + 1);
    } else {
      setLost(1);
    }
  }

  function playAgain(): void {
    setScore(0);
    setLost(0);
  }

  console.log(paintings[0].objectEndDate, paintings[1].objectEndDate);

  return lost === 0 ? <div>
  <img src={paintings[0].primaryImageSmall} alt="Painting One" />
  <img src={paintings[1].primaryImageSmall} alt="Painting Two" />
  <p>Is the second piece of art older or newer than the first?</p>
  <button onClick={() => handleButtonChoice("older")}>older</button>
  <button onClick={() => handleButtonChoice("newer")}>newer</button>
  <p>{score}</p>
</div> : <button onClick={playAgain}>Play Again</button>
}

export default App;
