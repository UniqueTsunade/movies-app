import { format } from "date-fns";

/* For Card.js*/

//Checking to get the path to the release date
export function handleDateError(releaseDate) {
  if (typeof releaseDate !== "string") {
    return "The release date is unknown";
  }
  try {
    return format(releaseDate, "MMMM dd, yyyy");
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
