import React, { Component } from "react";
import { parseISO, format } from "date-fns";
    
export default class Card extends Component {

  trimOverview = (overview, maxWords, title) => {
    const words = overview.split(" ");
    const isTitleLong = title.length > 25;

    //Determining the maximum number of words to trim
    const maxWordsToShow = isTitleLong ? maxWords - 13 : maxWords;

    if (words.length > maxWordsToShow) {
      return words.slice(0, maxWordsToShow).join(" ") + " ...";
    }

    return overview;
  };

    render() {
        const { movie } = this.props;
        let date = format(parseISO(movie.release_date), "MMMM dd, yyyy");
        let trimmedOverview = this.trimOverview(movie.overview, 20, movie.original_title);

        return (
            <div className="card">
              <div className="card__image-zone">
                <img className="card__poster" src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt="Movie image"/>
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
        )

    }
}



