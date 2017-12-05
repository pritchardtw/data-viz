function decimate(initialArray, interval) {
  let decimatedArray = [];
  for (let i = 0; i < initialArray.length; i += interval) {
    decimatedArray.push(initialArray[i]);
  }
  return decimatedArray;
}

export { decimate };
