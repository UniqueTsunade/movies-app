/* For Card.js*/

//Reduction of movie description
export function trimOverview(overview, maxWords) {
  const words = overview.split(" ");
  const isOverviewLong = words.length > maxWords;

  const maxWordsToShow = isOverviewLong
    ? words.slice(0, maxWords).join(" ") + " ..."
    : overview;

  return maxWordsToShow;
}
