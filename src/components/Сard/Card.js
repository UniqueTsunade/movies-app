// import React, { Component } from "react";

// import { trimOverview, getBorderColor } from "../../utils/helpers";
// import { handlePosterError, handleDateError, handleVoteAverage } from "../../utils/errors";
// import { Rate } from "antd";

// import MovieContext from "./../CardsList"

// export default class Card extends Component {

//   // state = {
//   //   rating: {
//   //     movieId: this.props.movie.id,
//   //     value: this.props.currentRating,
//   //   }
//   // };

//   static contextType = MovieContext;

//   state = {
//     rating: {
//       movieId: this.props.movie.id,
//       value: this.context.ratings[this.props.movie.id] || 0, // Используем значения из контекста
//     }
//   };

//   // handleRatingChange = (newValue) => {
//   //   const { movie } = this.props;
//   //   this.setState({
//   //     rating: {
//   //       movieId: movie.id,
//   //       value: newValue,
//   //     }
//   //   });
//   //   this.props.rateMovies(newValue);
//   // };

//   handleRatingChange = (newValue) => {
//     this.setState({
//       rating: {
//         movieId: this.props.movie.id,
//         value: newValue,
//       }
//     });
//     this.context.rateMovies(this.props.movie.id, newValue); // Используем метод из контекста
//   };

//   componentDidUpdate(prevProps) {
//     // Обновляем состояние, если movie.id изменился
//     if (prevProps.movie.id !== this.props.movie.id) {
//       this.setState({
//         rating: {
//           movieId: this.props.movie.id,
//           value: this.props.currentRating
//         }
//       });
//     }
//   }

//   render() {
//     const { movie } = this.props;

//     let trimmedOverview = trimOverview(movie.overview, 10);
//     let date = handleDateError(movie.release_date);
//     let posterImage = handlePosterError(movie.backdrop_path);
//     let rating = handleVoteAverage(movie.vote_average);


//     const borderColor = getBorderColor(rating);


//     console.log(this.state.rating)

//     return (


//       <div className="card">
//         <div className="card__image-zone">
//           <img className="card__poster" src={posterImage} alt="Poster" />
//         </div>
//         <div className="card__content-zone">
//           <div className="card__header">
//             <h1 className="card__title">{movie.original_title}</h1>
//             <div className="card__app-rating" style={{ border: `solid 2px ${borderColor}` }}>
//               <p>{rating}</p>
//             </div>
//           </div>
//           <p className="card__date">{date}</p>
//           <ul className="card__genres-list">
//             <li>
//               <a href="#">Action</a>
//             </li>
//             <li>
//               <a href="#">Drama</a>
//             </li>
//           </ul>
//           <p className="card__overview">{trimmedOverview}</p>
//         </div>
//         {/* <p className="card__overview">{trimmedOverview}</p> */}
//         <div className="card__rating">
//           {/* <Rate allowHalf onChange={this.handleRatingChange} value={this.state.rating.value} count={10} /> */}
//           <Rate allowHalf onChange={this.handleRatingChange} value={this.state.rating.value} count={10} />
//         </div>
//       </div>
//     );
//   }
// }


import React, { Component } from "react";

import { trimOverview, getBorderColor, makeGenresList } from "../../utils/helpers";
import {
  handlePosterError,
  handleDateError,
  handleVoteAverage,
} from "../../utils/errors";
import { Rate } from "antd";

import MovieContext from "../../utils/MovieContext";

export default class Card extends Component {
  state = {
    rating: {
      movieId: this.props.movie.id,
      value: this.props.currentRating,
    },
  };

  // handleRatingChange = (newValue, rateMovies) => {
  //   const { movie } = this.props;
  //   this.setState({
  //     rating: {
  //       movieId: movie.id,
  //       value: newValue,
  //     },
  //   });
  //   console.log("Новый рейтинг:", newValue);
  //   console.log("id фильма:", movie.id);
  //   rateMovies(movie.id, newValue);
  // };

//   handleRatingChange = (newValue, rateMovies) => {
//     const { movie } = this.props;
//     this.setState({
//         rating: {
//             movieId: movie.id,
//             value: newValue,
//         },
//     });
//     console.log("Новый рейтинг:", newValue);
//     console.log("id фильма:", movie.id);
//     rateMovies(movie, newValue); // Передаем весь объект movie
// };

// handleRatingChange = (newValue, rateMovies) => {
//   const { movie } = this.props;

//   // Обновляем состояние текущего рейтинга
//   this.setState({
//       rating: {
//           movieId: movie.id,
//           value: newValue,
//       },
//   });
  
//   // Обновляем рейтинг в родительском компоненте
//   rateMovies(movie, newValue);
// };


/*Верный вариант*/
handleRatingChange = (newValue, rateMovies) => {
  const { movie } = this.props;
  this.setState({
      rating: {
          movieId: movie.id,
          value: newValue,
      },
  });
  
  // Обновляем рейтинг в родительском компоненте
  rateMovies(movie, newValue);
};

  componentDidUpdate(prevProps) {
    if (prevProps.movie.id !== this.props.movie.id) {
      this.setState({
        rating: {
          movieId: this.props.movie.id,
          value: this.props.currentRating,
        },
      });
    }
  }


  render() {
    const { movie } = this.props;

    return (
      <MovieContext.Consumer>
        {({ rateMovies, genresList }) => {
          const trimmedOverview = trimOverview(movie.overview, 10);
          const date = handleDateError(movie.release_date);
          const posterImage = handlePosterError(movie.backdrop_path);
          const rating = handleVoteAverage(movie.vote_average);
          const borderColor = getBorderColor(rating);


          // console.log(movie.genre_ids)

          // const genresIds = this.makeGenresList(movie.genre_ids, genresList);

          const genresIds = makeGenresList(movie.genre_ids || [], genresList);
          

          return (
            <div className="card">
              <div className="card__image-zone">
                <img className="card__poster" src={posterImage} alt="Poster" />
              </div>
              <div className="card__content-zone">
                <div className="card__header">
                  <h1 className="card__title">{movie.original_title}</h1>
                  <div
                    className="card__app-rating"
                    style={{ border: `solid 2px ${borderColor}`}}
                  >
                    <p>{rating}</p>
                  </div>
                </div>
                <p className="card__date">{date}</p>
                <ul className="card__genres-list">{genresIds}</ul>
                <p className="card__overview">{trimmedOverview}</p>
              </div>
              <div className="card__rating">
                <Rate
                  allowHalf
                  onChange={(value) =>
                    this.handleRatingChange(value, rateMovies)
                  }
                  value={this.state.rating.value}
                  count={10}
                />
              </div>
            </div>
          );
        }}
      </MovieContext.Consumer>
    );
  }
}


