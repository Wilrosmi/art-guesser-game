import {IPainting} from "./types";

async function getAPainting(id: number): Promise<IPainting> {
  const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
  const resJson: IPainting = await response.json();
  return resJson;
}

export default getAPainting;