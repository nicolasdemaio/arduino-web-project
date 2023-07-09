export const calculateMaxium = (heartRatesHistory) => {
    return heartRatesHistory && heartRatesHistory.length > 0
    ? heartRatesHistory.reduce((min, current) =>
        Math.max(min, current)
      )
    : 0;
  }

  export const calculateMinimum = (heartRatesHistory) => {
      return heartRatesHistory && heartRatesHistory.length > 0
      ? heartRatesHistory.reduce((min, current) =>
          Math.min(min, current)
        )
      : 0;
  }

  export const calculateAverage = (heartRatesHistory) => {
    return heartRatesHistory && heartRatesHistory.length > 0
    ? Math.round(heartRatesHistory.reduce((acc, curr) => acc + curr, 0) /
      heartRatesHistory.length)
    : 0;
  }
