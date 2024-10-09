/*For CardList*/

//Getting the required movies for a specific pagination page
export function cutMoviesDisplay(currentPage, pageSize, movies) {
  const startIndex = (currentPage - 1) * pageSize;
  return movies.slice(startIndex, startIndex + pageSize);
}

export function getMoviesForRatedTab (movies, ratings) {
  return Object.keys(ratings)
  .filter((movieId) => ratings[movieId] > 0)
  .map((movieId) => movies.find((movie) => movie.id === parseInt(movieId)));
}


/* For Card.js*/

//Reduction of movie description
export function trimOverview(overview, maxWords) {
  if (typeof overview !== 'string' || overview.trim() === '') {
    return '';
  }
  const words = overview.split(" ");
  const isOverviewLong = words.length > maxWords;

  const maxWordsToShow = isOverviewLong
    ? words.slice(0, maxWords).join(" ") + " ..."
    : overview;

  return maxWordsToShow;
}


export function getBorderColor(rating) {
  const numericRating = parseFloat(rating);
  
  if (numericRating >= 0 && numericRating < 3) {
    return "#E90000"; //Red
  } else if (numericRating >= 3 && numericRating < 5) {
    return "#E97E00"; //Orange
  } else if (numericRating >= 5 && numericRating < 7) {
    return "#E9D100"; //Yellow
  } else if (numericRating >= 7) {
    return "#66E900"; //Green
  }
  
  return "#E90000"; //Default value if rating is invalid
} 


export function makeGenresList(movieGenresIds, allGenresIds) {
  //Retrieving an array of genre objects
  let movieGenresArray = Object.values(allGenresIds).flat();
  //If the array of identifiers is empty, return Unknown
  if (movieGenresIds.length === 0) {
    return <li key="unknown">Unknown</li>;
  }
  //Filter and create a list of genres
  return movieGenresArray
    .filter((obj) => movieGenresIds.includes(obj.id))
    .map((obj) => <li key={obj.id}>{obj.name}</li>);
}

export function getMoviesForSwitcher(movies, ratings) {
  return Object.keys(ratings)
  .filter((movieId) => ratings[movieId] > 0)
  .map((movieId) => movies.find((movie) => movie.id === parseInt(movieId)))
}