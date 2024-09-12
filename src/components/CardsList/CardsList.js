import React, { Component } from "react";
import Card from "../Сard";
import MoviesCollection from "../../services/MoviesCollection";
import { Spin, Alert } from "antd";

export default class CardsList extends Component {
  MoviesCollectionInstance = new MoviesCollection();

  state = {
    movies: [],
    moviesList: [],
    loading: false,
    error: false,
    message: "",
  };

  componentDidMount() {
    this.updateMovies();
  }

  //Movie list update
  updateMovies = async () => {
    this.setState({ loading: true, error: false, message: "" }); // Reset state
    try {
      const movies = await this.fetchMovies();
      this.setMovies(movies);
    } catch (error) {
      this.handleError(error);
    }
  };

  //Receiving movies from the server
  fetchMovies = async () => {
    const title = "lord";
    const movies = await this.MoviesCollectionInstance.getMovies(title);

    if (movies.length === 0) {
      throw new Error(
        `No films with the title "${title}" have been found. Try again.`
      );
    } //Checking the title here will throw an error if there are no movies

    return movies;
  };

  //Setting a new state
  setMovies = (movies) => {
    const moviesList = this.processMovies(movies);
    this.setState({
      movies,
      moviesList,
      loading: false, //Set loading to false only after successfully receiving movies
      error: false,
    });
  };

  //Creating a complete list of films
  processMovies = (movies) => {
    return movies.map((movie) => <Card key={movie.id} movie={movie} />);
  };

  //Handling possible errors
  handleError = (error) => {
    console.error(error);
    this.setState({
      loading: false,
      error: true,
      message: error.message || "An unknown error occurred",
    });
  };

  render() {
    const { moviesList, loading, error, message } = this.state;

    let loader = loading ? <Spin fullscreen size="large" /> : null;
    let errorMessage = error ? (
      <Alert message="Error" description={message} type="error" />
    ) : null;
    let content = !loading && !error ? moviesList : null;

    return (
      <div className="cards-list">
        {loader}
        {errorMessage}
        {content}
      </div>
    );
  }
}


