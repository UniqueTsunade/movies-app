import React, { createContext } from "react";

// const MovieContext = createContext();

const MovieContext = createContext({
    rateMovies: () => {}, // Default function for safety
    currentRating: 0,
  });

export default MovieContext;