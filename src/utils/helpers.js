/* For Card.js*/

import { resetWarned } from "antd/es/_util/warning";

// //Reduction of movie description
// export function trimOverview(overview, maxWords) {
//   const words = overview.split(" ");
//   const isOverviewLong = words.length > maxWords;

//   const maxWordsToShow = isOverviewLong
//     ? words.slice(0, maxWords).join(" ") + " ..."
//     : overview;

//   return maxWordsToShow;
// }

export function trimOverview(overview, maxWords) {
  // Проверяем, является ли overview строкой и не является ли она пустой
  if (typeof overview !== 'string' || overview.trim() === '') {
    return ''; // Возвращаем пустую строку или любое другое значение по умолчанию
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
    return "#E90000"; // Красный
  } else if (numericRating >= 3 && numericRating < 5) {
    return "#E97E00"; // Оранжевый
  } else if (numericRating >= 5 && numericRating < 7) {
    return "#E9D100"; // Желтый
  } else if (numericRating >= 7) {
    return "#66E900"; // Зеленый
  }
  
  return "#E90000"; // Значение по умолчанию, если рейтинг недопустимый
} 


export function makeGenresList(movieGenresIds, allGenresIds) {

  console.log(movieGenresIds)
  // Извлекаем массив объектов жанров
  let movieGenresArray = Object.values(allGenresIds).flat();

  // Если массив идентификаторов пуст, возвращаем Unknown
  if (movieGenresIds.length === 0) {
    return <li key="unknown">Unknown</li>;
  }

  // Фильтруем и создаем список жанров
  return movieGenresArray
    .filter((obj) => movieGenresIds.includes(obj.id))
    .map((obj) => <li key={obj.id}>{obj.name}</li>);
}