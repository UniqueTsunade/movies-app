import { format, parseISO } from "date-fns";

/* For Card.js*/

//Checking to get the path to the release date
export function handleDateError(releaseDate) {
  if (!releaseDate || typeof releaseDate !== "string") {
    return "The release date is unknown";
  }

  try {
    const parsedDate = parseISO(releaseDate);
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format");
    }
    return format(parsedDate, "MMMM dd, yyyy");
  } catch (error) {
    console.error(`Error parsing release date: ${error}`);
    return "The release date is unknown";
  }
}

//Checking to get the path to the image
export function handlePosterError(imagePath) {
  if (typeof imagePath !== "string") {
    return null;
  }
  try {
    return `https://image.tmdb.org/t/p/w500${imagePath}`;
  } catch (error) {
    console.error(`Error processing image path: ${error}`);
    return null;
  }
}


//Checking to get the path to the vote average
export function handleVoteAverage(voteAverage) {
  if (typeof voteAverage !== "number" || isNaN(voteAverage) || voteAverage === 0) {
    return 0;
  }
    return voteAverage.toFixed(1);
}
