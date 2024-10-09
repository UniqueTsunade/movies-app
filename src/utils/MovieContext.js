import { createContext } from "react";

const MovieContext = createContext({
    rateMovies: () => {},
    currentRating: 0,
  });

export default MovieContext;