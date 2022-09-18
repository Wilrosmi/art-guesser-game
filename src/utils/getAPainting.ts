import { IPainting } from "./types";
import getRandomObjectId from "./getRandomObjectId";

async function getAPainting(artIds: number[]): Promise<IPainting> {
  let i = 0;
  while (i < 10) {
    const candidatePainting = await fetchFromApi(getRandomObjectId(artIds));
    if (candidatePainting.primaryImageSmall.length > 0) {
      return candidatePainting;
    }
    i++;
  }
  return {
    title: "error: could not get object from API",
    primaryImageSmall: "",
    objectEndDate: 0
  }
}

async function fetchFromApi(id: number): Promise<IPainting> {
  const response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );
  const resJson: IPainting = await response.json();
  return resJson;
}

export default getAPainting;
