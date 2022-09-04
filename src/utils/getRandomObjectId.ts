function getRandomObjectId(arr: number[]): number {
  return arr[Math.round(Math.random() * arr.length)];
} 

export default getRandomObjectId;