import React, { Component } from "react";

import { trimOverview } from "../../utils/helpers";
import { handlePosterError, handleDateError } from "../../utils/errors";

export default class Card extends Component {
  render() {
    const { movie } = this.props;

    let trimmedOverview = trimOverview(movie.overview, 10);
    let date = handleDateError(movie.release_date);
    let posterImage = handlePosterError(movie.backdrop_path);

    return (
      <div className="card">
        <div className="card__image-zone">
          <img className="card__poster" src={posterImage} alt="Poster" />
        </div>
        <div className="card__content-zone">
          <h1 className="card__title">{movie.original_title}</h1>
          <p className="card__date">{date}</p>
          <ul className="card__genres-list">
            <li>
              <a href="#">Action</a>
            </li>
            <li>
              <a href="#">Drama</a>
            </li>
          </ul>
          <p className="card__overview">{trimmedOverview}</p>
        </div>
      </div>
    );
  }
}



