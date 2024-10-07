import React, { Component } from "react";

import Card from "../Сard";

import MoviesCollection from "../../services/MoviesCollection";
import MoviesGuestSession from "../../services/MoviesGuestSession";

import {
  renderLoader,
  renderError,
  renderWarning,
  renderContent,
} from "../../utils/renderUtils";
import { Pagination } from "antd";

import SearchForm from "../SearchForm";
import TopTabs from "../TopTabs";

import MovieContext from "../../utils/MovieContext";

export default class CardsList extends Component {
  count = 0;
  cache = {};

  MoviesCollectionInstance = new MoviesCollection();
  GuestSession = new MoviesGuestSession();

  state = {
    /* Для комопонента pagination */
    currentPage: 1,

    /* Для отображения метода getMovies */
    remainingMovies: [], // Для хранения оставшихся фильмов
    movies: [], // Фильмы полученные с сервера
    allMovies: [], // Все полученные фильмы
    displayedMovies: [],
    title: "naruto",
    totalMovies: 0,
    totalPages: 0,
    pageSize: 6, // или любое другое значение по умолчанию
    requestedPage: 1,

    /* Визуальные приколы */
    loading: false,
    error: false,
    message: "",
    warningMessage: "",

    /* Отображение жанров и рейтингов */
    sessionId: null, // Новое свойство для хранения гостевого ID
    ratings: {}, // Храним рейтинги
    genresList: [],
    ratedMovies: [], // Состояние для оцененных фильмов
  };

  addTitle = (searchText) => {
    this.cache = {}; //Reset cache
    this.setState({ title: searchText }, this.updateMovies); //Update the title and call updateMovies
  };

  // componentDidMount() {
  //   this.updateMovies(); //Initial movie request
  // }

  async componentDidMount() {
    try {
      const sessionId = await this.GuestSession.createGuestSession();
      this.setState({ sessionId: sessionId.guest_session_id });
      await this.updateMovies(); // Инициализация запроса к фильмам
    } catch (error) {
      console.error("Ошибка при создании сессии:", error);
    }
  }

  fetchMovies = async (title) => {
    const sessionId = await this.GuestSession.createGuestSession();
    const genresList = await this.MoviesCollectionInstance.getGenresMovies();

    this.setState({
      sessionId: sessionId.guest_session_id,
      genresList: genresList,
    });

    let allMovies = [];
    let totalPages = 0;

    // Начнем с первой страницы
    let currentPage = 1;
    do {
      const movies = await this.MoviesCollectionInstance.getMovies(
        title,
        currentPage,
        sessionId.guest_session_id
      );
      allMovies = [...allMovies, ...movies.results]; // Сохраняем все фильмы
      totalPages = movies.totalPages; // Получаем общее количество страниц
      currentPage++;
    } while (currentPage <= totalPages);

    return {
      results: allMovies,
      totalResults: allMovies.length,
      totalPages: totalPages,
    };
    
  };


  setMovies = (movies, totalMovies, totalPages) => {
    // Обновляем состояние
    this.setState(
      {
        allMovies: movies,
        totalMovies,
        totalPages,
        loading: false,
        error: false,
      },
      this.updateDisplayedMovies
    );
  };

  updateDisplayedMovies = () => {
    const { currentPage, pageSize, allMovies } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    const displayedMovies = allMovies.slice(startIndex, startIndex + pageSize);

    this.setState({ movies: displayedMovies });
    console.log(`Счетчик: ${this.count++}`)
  };

  updateMovies = async () => {
    this.setState({ loading: true, error: false, message: "" });
    try {
      const { title } = this.state;

      // Загружаем все фильмы
      const { results, totalResults, totalPages } = await this.fetchMovies(
        title
      );

      // Сохраним результаты
      this.setMovies(results, totalResults, totalPages);
    } catch (error) {
      this.handleError(error);
    }
  };

  processMovies = (movies) => {
    const { ratings } = this.state; // Получаем рейтинги из состояния

    return movies.map((movie) => (
      <Card
        key={movie.id}
        movie={movie}
        currentRating={ratings[movie.id] || 0} // Передавайте только текущий рейтинг
      />
    ));
  };

  // rateMovies = async (movieId, rating) => {
  //   this.setState({ loading: true });

  //   try {
  //     const sessionId = this.state.sessionId;
  //     const rateMoviesResponse = await this.MoviesCollectionInstance.rateMovies(
  //       movieId,
  //       rating,
  //       sessionId
  //     );

  //     // Обновляем состояние сразу после успешной оценки
  //     this.setState((prevState) => ({
  //       ratings: { ...prevState.ratings, [movieId]: rating },
  //       isRated: true,
  //     }));

  //     return rateMoviesResponse;
  //   } catch (error) {
  //     console.error("Error in rateMovies implementation:", error);
  //   } finally {
  //     this.setState({ loading: false });
  //   }
  // };


//   rateMovies = async (movieId, rating) => {
//     this.setState({ loading: true });

//     try {
//         const sessionId = this.state.sessionId;
//         const rateMoviesResponse = await this.MoviesCollectionInstance.rateMovies(
//             movieId,
//             rating,
//             sessionId
//         );

//         // Обновляем состояние сразу после успешной оценки
//         this.setState((prevState) => {
//             // Добавляем новый оцененный фильм в ratedMovies
//             const updatedRatedMovies = [...prevState.ratedMovies, { ...movieData, rating }];

//             return {
//                 ratings: { ...prevState.ratings, [movieId]: rating },
//                 ratedMovies: updatedRatedMovies,
//                 isRated: true,
//             };
//         });

        
//         return rateMoviesResponse;
//     } catch (error) {
//         console.error("Error in rateMovies implementation:", error);
//     } finally {
//         this.setState({ loading: false });
//     }
// };

// rateMovies = async (movie, rating) => {
//   this.setState({ loading: true });

//   try {
//       const sessionId = this.state.sessionId;
//       const rateMoviesResponse = await this.MoviesCollectionInstance.rateMovies(
//           movie.id,
//           rating,
//           sessionId
//       );

//       // Обновляем состояние сразу после успешной оценки
//       this.setState((prevState) => {
//           // Добавляем новый оцененный фильм в ratedMovies
//           const updatedRatedMovies = [
//               ...prevState.ratedMovies,
//               { ...movie, rating } // Сохраняем весь объект фильма вместе с рейтингом
//           ];

//           return {
//               ratings: { ...prevState.ratings, [movie.id]: rating },
//               ratedMovies: updatedRatedMovies,
//               isRated: true,
//           };
//       });

//       return rateMoviesResponse;
//   } catch (error) {
//       console.error("Error in rateMovies implementation:", error);
//   } finally {
//       this.setState({ loading: false });
//   }
// };

/*Верный вариант*/
rateMovies = async (movie, rating) => {
  this.setState({ loading: true });

  try {
      const sessionId = this.state.sessionId;
      await this.MoviesCollectionInstance.rateMovies(movie.id, rating, sessionId);

      // Обновляем состояние сразу после успешной оценки
      this.setState((prevState) => {
          // Проверяем, существует ли фильм в ratedMovies
          const existingMovieIndex = prevState.ratedMovies.findIndex(ratedMovie => ratedMovie.id === movie.id);

          let updatedRatedMovies;

          if (existingMovieIndex !== -1) {
              // Если фильм существует, обновляем его рейтинг
              updatedRatedMovies = [...prevState.ratedMovies];
              updatedRatedMovies[existingMovieIndex] = { ...updatedRatedMovies[existingMovieIndex], rating };
          } else {
              // Если фильм не существует, добавляем его в массив
              updatedRatedMovies = [
                  ...prevState.ratedMovies,
                  { ...movie, rating }
              ];
          }

          return {
              ratings: { ...prevState.ratings, [movie.id]: rating },
              ratedMovies: updatedRatedMovies,
              isRated: true,
          };
      });
  } catch (error) {
      console.error("Error in rateMovies implementation:", error);
  } finally {
      this.setState({ loading: false });
  }
};


  handleTabChange = async (key) => {
    this.setState({ loading: true });
    const sessionId = this.state.sessionId;

    // Проверка sessionId
    if (!sessionId) {
      console.error("Guest session ID не найден.");
      this.setState({ loading: false });
      return;
    }

    if (key === "2") {
      // Проверяем, есть ли уже оцененные фильмы в состоянии
      if (this.state.ratedMovies.length === 0) {
        try {
          const ratedMovies = await this.MoviesCollectionInstance.getRatedMovies(sessionId);
        
          this.setState({
            ratedMovies, // Сохраняем оцененные фильмы в отдельное состояние
            movies: ratedMovies,
            totalMovies: ratedMovies.length,
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error("Ошибка 404: Неправильный guest_session_id или отсутствуют оцененные фильмы.");
          } else {
            console.error("Ошибка получения оцененных фильмов:", error);
          }
          this.setState({ movies: [], totalMovies: 0 });
        }
      } else {
        // Если оцененные фильмы уже загружены, просто устанавливаем их
        this.setState({
          movies: this.state.ratedMovies,
          totalMovies: this.state.ratedMovies.length,
        });
      }
    } else if (key === "1") {
      await this.updateMovies();
    }

    this.setState({ loading: false });
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
    this.setState({ currentPage: page }, this.updateDisplayedMovies);

  };

  render() {
    const {
      movies,
      allMovies,
      loading,
      error,
      message,
      warningMessage,
      currentPage,
      totalMovies,
    } = this.state;
    const moviesList = this.processMovies(movies);
    console.log(this.state.ratedMovies);
   

    return (
      <MovieContext.Provider
        value={{
          rateMovies: this.rateMovies, // Передаем метод в контекст
          ratings: this.state.ratings, // Можем передать все рейтинги
          genresList: this.state.genresList,
        }}
      >
        <>
          <TopTabs handleTabChange={this.handleTabChange} />
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
              pageSize={6}
              onChange={this.switchPage}
              showSizeChanger={false}
            />
          </div>
        </>
      </MovieContext.Provider>
    );
  }
}
