import React, { Component } from "react";
import Card from "../Сard";
import MoviesCollection from "../../services/MoviesCollection";

import { renderLoader, renderError, renderWarning, renderContent } from "../../utils/renderUtils";

import SearchForm from "../SearchForm";

export default class CardsList extends Component {

  MoviesCollectionInstance = new MoviesCollection();

  state = {
    movies: [],
    moviesList: [],
    title: "return",
    loading: false,
    error: false,
    message: "",
    warningMessage: "",
  };

  addTitle = (searchText) => {
    this.setState({ title: searchText }, this.updateMovies); //Update the title and call updateMovies
  };

  componentDidMount() {
    this.updateMovies();
  }

  //Movie list update
  updateMovies = async () => {
    this.setState({ loading: true, error: false, message: "" }); //Reset state
    try {
      const movies = await this.fetchMovies();
      this.setMovies(movies);
    } catch (error) {
      this.handleError(error);
    }
  };

  //Receiving movies from the server
  fetchMovies = async () => {
    const title = this.state.title;
    console.log(title);
    const movies = await this.MoviesCollectionInstance.getMovies(title);
    return movies;
  };

  //Setting a new state
  setMovies = (movies) => {
    let newWarningMessage = "";
    if (movies.length === 0 && this.state.title.trim() !== "") {
      newWarningMessage = `No films with the title "${this.state.title}" have been found. Try again.`;
    } //Checking the title here will throw an error if there are no movies
    const moviesList = this.processMovies(movies);
    this.setState({
      movies,
      moviesList,
      loading: false, //Set loading to false only after successfully receiving movies
      error: false,
      warningMessage: newWarningMessage,
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

  //Handling possible warning
  handleWarning = () => {
    this.setState({ warningMessage: "" }, () => {
      //Resetting title state in SearchForm
      if (this.searchFormRef) {
        this.searchFormRef.resetTitle();
      }
      this.updateMovies();
    });
  };

  render() {

    const { moviesList, loading, error, message, warningMessage } = this.state;

    return (
      <>
        <SearchForm addTitle={this.addTitle} ref={(ref) => (this.searchFormRef = ref)} />
        <div className="cards-list">
          {renderLoader(loading)}
          {renderError(error,message)}
          {renderWarning(warningMessage,this.handleWarning)}
          {renderContent(loading, error, moviesList)}
        </div>
      </>
    )
  }
}
