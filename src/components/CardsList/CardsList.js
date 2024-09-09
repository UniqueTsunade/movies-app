import React, { Component } from "react";
import Card from "../Сard";
import MoviesCollection from "../../services/MoviesCollection";

export default class CardsList extends Component {

  MoviesCollectionInstance = new MoviesCollection(); 

  state = {
    movies: [],
    moviesList: [], 
  };

  componentDidMount() {
    this.updateMovie();
  }

  getMovies = async() => {
    const title = "lord";
    const movie = await this.MoviesCollectionInstance.getMovies(title);
    return movie;
  }

  processMovies = (movies) => {
    const moviesList = movies.map((movie) => (
      <Card key={movie.id} movie={movie} />
    ));

    return moviesList;
  }

  updateMovie = async() => {
    const movies = await this.getMovies();
    const moviesList = this.processMovies(movies);
    this.setState({ movies, moviesList })
  }


  render() {
    const { moviesList } = this.state;

    return (
      <div className="cards-list">
        {moviesList}
      </div>
    );
  }
}