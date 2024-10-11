import React, { Component } from "react";

import Card from "../Сard";

import MoviesCollection from "../../services/MoviesCollection";
import MoviesGuestSession from "../../services/MoviesGuestSession";

import { cutMoviesDisplay, getMoviesForRatedTab, getMoviesForSwitcher } from '../../utils/helpers';
import {
  renderLoader,
  renderError,
  renderWarning,
  renderRatedTabMessage,
  renderContent,
} from "../../utils/renderUtils";
import { Pagination } from "antd";

import SearchForm from "../SearchForm";
import TopTabs from "../TopTabs";

import MovieContext from "../../utils/MovieContext";

export default class CardsList extends Component {
  cache = {};

  MoviesCollectionInstance = new MoviesCollection();
  GuestSession = new MoviesGuestSession();

  state = {
    currentPage: 1,
    activeTab: "1", 
    movies: [], 
    displayedMovies: [],
    title: "return",
    totalMovies: 0,
    totalPages: 0,
    pageSize: 6, 
    loading: false,
    error: false,
    message: "",
    warningMessage: "",
    ratedTabMessage: "",
    sessionId: null, 
    ratings: {}, 
    genresList: [],
    ratedMovies: [], 
  };

  addTitle = (searchText) => {
    this.cache = {}; //Reset cache
    this.setState({ title: searchText }, this.updateMovies); //Update the title and call updateMovies
  };

  async componentDidMount() {
    try {
      //Setting the loading state before the request
      this.setState({ loading: true });
      //Running a request to create a guest session
      const { guest_session_id } = await this.GuestSession.createGuestSession();
      //Update the state and call the movie update
      this.setState({
        sessionId: guest_session_id,
        loading: false, //Remove the loading indicator after receiving the sessionId
      });
      //Updating movies after setting sessionId
      await this.updateMovies();
    } catch (error) {
      console.error("Error creating session:", error);
      this.handleError(error); //Calling the error handler
      this.setState({
        loading: false,
      });
    }
  }

  fetchMovies = async (title) => {
    const { sessionId } = this.state;
    //Checking the cache
    if (this.cache[title]) {
      return this.cache[title];
    }
    //Retrieving genres and updating state
    await this.loadGenres();
    //Getting all movies
    const allMovies = await this.getAllMovies(title, sessionId);
    //Forming the result
    const result = {
      results: allMovies,
    };
    //Save to cache
    this.cache[title] = result;
    return result;
  };

  //Loading genres from the server
  loadGenres = async () => {
    const genresList = await this.MoviesCollectionInstance.getGenresMovies();
    this.setState({ genresList });
  };

  //Getting all movie pages
  getAllMovies = async (title, sessionId) => {
    let allMovies = [];
    let currentPage = 1;
    let totalPages;

    try {
      do {
        const { results, totalPages: pages, totalResults } =
          await this.MoviesCollectionInstance.getMovies(
            title,
            currentPage,
            sessionId
          );
  
        allMovies = [...allMovies, ...results];
        totalPages = pages;
        currentPage++;
        console.log(totalResults)
      } while (currentPage <= totalPages);
  
      // Return all movies
      return allMovies;
    } catch (error) {
      this.handleError(error); 
    }
  };

  updateMovies = async () => {
    this.setState({
      loading: true,
      error: false,
      message: "",
      errorMessage: "",
    });
    try {
      const { title } = this.state;
      const { results } = await this.fetchMovies(title);
      this.setMovies(results);
    } catch (error) {
      this.handleError(error);
    }
  };


  setMovies = (movies) => {
    const { pageSize } = this.state; 
    const totalPages = Math.ceil(movies.length / pageSize);
    let newWarningMessage = "";
    if (movies.length === 0 && this.state.title.trim() !== "") {
      newWarningMessage = `No films with the title "${this.state.title}" have been found. Try again.`;
    }

    this.setState(
      {
        movies,
        totalMovies: movies.length, 
        totalPages,
        loading: false,
        warningMessage: newWarningMessage,
        error: false,
      },
      this.updateDisplayedMovies 
    );
  };


  updateDisplayedMovies = () => {
    const { currentPage, pageSize, movies, ratings, activeTab } = this.state;
    let displayedMovies = cutMoviesDisplay(currentPage, pageSize, movies);
    if (activeTab === "2") {
      const ratedMovies = getMoviesForRatedTab(movies, ratings);
      displayedMovies = cutMoviesDisplay(ratedMovies, currentPage, pageSize);
    }
    //Update the state with the displayed films
    this.setState({ displayedMovies });
  };

  processMovies = (movies) => {
    const { ratings } = this.state;

    return movies.map((movie) => (
      <Card
        key={movie.id}
        movie={movie}
        currentRating={ratings[movie.id] || 0}
      />
    ));
  };

  rateMovies = async (movie, rating) => {
    this.setState({ loading: true });

    //Update status for rated films and ratings
    this.updateRatingsState(movie, rating);

    //Asynchronously send data to the server and update the display
    try {
      await this.submitRatingToServer(movie, rating);
      await this.refreshDisplayedMovies();
    } catch (error) {
      console.error("Error in rateMovies implementation:", error);
    } finally {
      //Disable the loader after completing all operations
      this.setState({ loading: false });
    }
  };

  updateRatingsState = (movie, rating) => {
    this.setState((prevState) => {
      const updatedRatedMovies = { ...prevState.ratedMovies };

      if (rating === 0) {
        //If the rating is 0, we remove the film from the list of rated ones
        delete updatedRatedMovies[movie.id];
      } else {
        //If the rating is more than 0, update or add the film
        updatedRatedMovies[movie.id] = { ...movie, rating };
      }

      return {
        ratings: { ...prevState.ratings, [movie.id]: rating }, // Update the rating
        ratedMovies: updatedRatedMovies, //Update rated films
        isRated: true,
      };
    });
  };

  submitRatingToServer = async (movie, rating) => {
    const sessionId = this.state.sessionId;
    try {
      await this.MoviesCollectionInstance.rateMovies(
        movie.id,
        rating,
        sessionId
      );
      //Successful sending of data, clearing cache for rated movies
      delete this.cache["ratedMovies"];
    } catch (error) {
      this.handleError(error);
      console.error("Error in rateMovies implementation:", error);
    }
  };

  refreshDisplayedMovies = async () => {
    if (this.state.activeTab === "2") {
      await this.handleTabChange("2");
    } else {
      this.updateDisplayedMovies();
    }
  };

  handleTabChange = async (key) => {
    this.setState({ activeTab: key, loading: true });

    const { sessionId, pageSize, ratedMovies } = this.state;

    if (key === "2") {
        //If there are already rated films available, we display them immediately
        if (ratedMovies.length > 0) {
            this.setState({
                displayedMovies: ratedMovies.slice(0, pageSize),
                totalMovies: ratedMovies.length,
                totalPages: Math.ceil(ratedMovies.length / pageSize),
                currentPage: 1,
                loading: false,
                ratedTabMessage: "",
            });
        }
        //Launch a request to receive rated films
        await this.fetchRatedMovies(sessionId); 
    } else if (key === "1") {
        //If we switch to the first tab, we display regular movies
        const { movies } = this.state;
        this.setState({
            displayedMovies: movies.slice(0, pageSize),
            totalMovies: movies.length,
            totalPages: Math.ceil(movies.length / pageSize),
            currentPage: 1,
            loading: false,
            ratedTabMessage: "",
        });
    }
};


  fetchRatedMovies = async (sessionId) => {
    try {
      const updatedRatedMovies =
        await this.MoviesCollectionInstance.getRatedMovies(sessionId);

      if (!updatedRatedMovies || updatedRatedMovies.length === 0) {
        this.setState({
          displayedMovies: [],
          totalMovies: 0,
          totalPages: 0,
          loading: false,
          ratedTabMessage: "You haven't rated any films yet",
        });
      } else {
        this.setState({
          ratedMovies: updatedRatedMovies, //Update the list of rated films
          displayedMovies: updatedRatedMovies.slice(0, this.state.pageSize), //Updating the displayed movies
          totalMovies: updatedRatedMovies.length,
          totalPages: Math.ceil(
            updatedRatedMovies.length / this.state.pageSize
          ),
          currentPage: 1,
          loading: false,
          ratedTabMessage: "", 
        });
      }
    } catch (error) {
      this.handleError(error)
      console.error("Error fetching rated movies:", error);
      this.setState({
        loading: false,
        message: "An error occurred while retrieving rated movies.",
      });
    } finally {
      this.setState({ loading: false });
    }
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
    const { pageSize, movies, ratings } = this.state;
    const startIndex = (page - 1) * pageSize;

    const displayedMovies = this.state.activeTab === "2" 
    ? getMoviesForSwitcher(movies, ratings)
    : movies;

    this.setState({
      displayedMovies: displayedMovies.slice(startIndex, startIndex + pageSize),
      currentPage: page,
    });
  };
  

  render() {
    const {
      activeTab,
      displayedMovies,
      ratedTabMessage,
      pageSize,
      loading,
      error,
      message,
      warningMessage,
      currentPage,
      totalMovies,
    } = this.state;

    const moviesList = this.processMovies(displayedMovies); 
   

    return (
      <MovieContext.Provider
        value={{
          rateMovies: this.rateMovies, 
          ratings: this.state.ratings, 
          genresList: this.state.genresList,
        }}
      >
        <>
          <TopTabs handleTabChange={this.handleTabChange} />
          {activeTab === "1" && (
            <SearchForm
              addTitle={this.addTitle}
              ref={(ref) => (this.searchFormRef = ref)}
            />
          )}
          <div className="container">
            <div className="cards-list">
              {renderLoader(loading)}
              {renderError(error, message)}
              {activeTab === "1" && renderWarning(warningMessage, this.handleWarning)}
              {renderRatedTabMessage(ratedTabMessage)}
              {renderContent(loading, error, moviesList)}
            </div>
            <Pagination
              className="pagination"
              current={currentPage}
              total={totalMovies}
              pageSize={pageSize}
              onChange={this.switchPage}
              showSizeChanger={false}
            />
          </div>
        </>
      </MovieContext.Provider>
    );
  }
}