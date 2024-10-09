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

handleRatingChange = (newValue, rateMovies) => {
  const { movie } = this.props;
  this.setState({
      rating: {
          movieId: movie.id,
          value: newValue,
      },
  });
  rateMovies(movie, newValue)
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
    console.log(movie);

    return (
      <MovieContext.Consumer>
        {({ rateMovies, genresList }) => {
          const trimmedOverview = trimOverview(movie.overview, 10);
          const date = handleDateError(movie.release_date);
          const posterImage = handlePosterError(movie.backdrop_path);
          const rating = handleVoteAverage(movie.vote_average);
          const borderColor = getBorderColor(rating);

          const genresIds = makeGenresList(movie.genre_ids || [], genresList);

          return (
            <div className="card">
                <img className="card__poster" src={posterImage} alt="Poster" />
              <div className="card__content-zone">
                <div className="card__header">
                  <h1 className="card__title">{movie.original_title}</h1>
                  <div
                    className="card__app-rating"
                    style={{border: `solid 2px ${borderColor}`}}
                  >
                    <p>{rating}</p>
                  </div>
                </div>
                <p className="card__date">{date}</p>
                <ul className="card__genres-list">{genresIds}</ul>
                <p className="card__overview--desktop">
                  {trimmedOverview}
                </p>
              </div>
              <p className="card__overview--mobile">
                {trimmedOverview}
              </p>
                <Rate
                  allowHalf
                  onChange={(value) =>
                    this.handleRatingChange(value, rateMovies)
                  }
                  value={this.state.rating.value}
                  count={10}
                />
            </div>
          );
        }}
      </MovieContext.Consumer>
    );
  }
}


