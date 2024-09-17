import React, { Component } from "react";
import Card from "../Сard";
import MoviesCollection from "../../services/MoviesCollection";

import {
  renderLoader,
  renderError,
  renderWarning,
  renderContent,
} from "../../utils/renderUtils";
import { Pagination } from "antd";

import SearchForm from "../SearchForm";

export default class CardsList extends Component {
  cache = {};

  MoviesCollectionInstance = new MoviesCollection();

  state = {
    movies: [],
    title: "return",
    loading: false,
    error: false,
    message: "",
    warningMessage: "",
    currentPage: 1,
    totalMovies: 0,
  };

  addTitle = (searchText) => {
    this.cache = {}; //Reset cache
    this.setState({ title: searchText }, this.updateMovies); //Update the title and call updateMovies
  };

  componentDidMount() {
    this.updateMovies(); //Initial movie request
  }

  //Movie list update
  updateMovies = async () => {
    this.setState({ loading: true, error: false, message: "" }); //Reset state
    try {
      const { title, currentPage } = this.state;
      const { results, totalResults } = await this.fetchMovies(
        title,
        currentPage
      );
      this.setMovies(results, totalResults);
    } catch (error) {
      this.handleError(error);
    }
  };

  //Receiving movies from the server
  fetchMovies = async (title, page) => {
    const cacheKey = `${title}_page_${page}`;

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }
    const movies = await this.MoviesCollectionInstance.getMovies(title, page);
    this.cache[cacheKey] = movies;
    return movies;
  };

  //Setting a new state
  setMovies = (movies, totalMovies) => {
    let newWarningMessage = "";
    if (movies.length === 0 && this.state.title.trim() !== "") {
      newWarningMessage = `No films with the title "${this.state.title}" have been found. Try again.`;
    }
    this.setState({
      movies,
      loading: false,
      error: false,
      warningMessage: newWarningMessage,
      totalMovies,
    });
  };

  //Creating a complete list of films
  processMovies = (movies) => {
    return movies.map((movie) => <Card key={movie.id} movie={movie} />);
  };

  //Handling possible warning
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
    this.cache = {}; //Reset cache
    this.setState({ warningMessage: "" }, () => {
      //Resetting title state in SearchForm
      if (this.searchFormRef) {
        this.searchFormRef.resetTitle();
      }
      this.updateMovies();
    });
  };

  switchPage = (page) => {
    this.setState({ currentPage: page }, this.updateMovies);
  };

  render() {
    const {
      movies,
      loading,
      error,
      message,
      warningMessage,
      currentPage,
      totalMovies,
    } = this.state;
    const moviesList = this.processMovies(movies);

    return (
      <>
        <SearchForm
          addTitle={this.addTitle}
          ref={(ref) => (this.searchFormRef = ref)}
        />
        <div className="container">
          <div className="cards-list">
            {renderLoader(loading)}
            {renderError(error, message)}
            {renderWarning(warningMessage, this.handleWarning)}
            {renderContent(loading, error, moviesList)}
          </div>
          <Pagination
            className="pagination"
            current={currentPage}
            total={totalMovies}
            pageSize={20}
            onChange={this.switchPage}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  }
}
