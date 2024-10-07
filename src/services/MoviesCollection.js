export default class MoviesCollection {
  #apiBase = "https://api.themoviedb.org/3";
  #apiKey = "a0f2f3570d1fbaf0db0cd04feba6ba67";

  async getResource(url, params = {}) {
    const apiUrl = `${this.#apiBase}${url}`;
    const queryParams = new URLSearchParams({
      api_key: this.#apiKey,
      ...params,
    });
    const fullUrl = `${apiUrl}?${queryParams.toString()}`;

    try {
      const res = await fetch(fullUrl);
      //Checking the success of the server response
      if (!res.ok) {
        console.error(`Could not fetch ${apiUrl}, received ${res.status}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      //Handling fetch errors
      console.error("Fetch error:", error);
      if (error instanceof TypeError) {
        throw new Error(
          "No internet connection or failed to connect to the server. Please check your network settings."
        );
      }
      throw new Error("Failed to fetch data. Please try again later.");
    }
  }

  async getMovies(title, page = 1, sessionId) {
    const params = { query: title, page, sessionId };
    const res = await this.getResource("/search/movie", params);
    if (!sessionId) {
      console.warn(
        "No session ID provided. Results may be limited or authentication may fail."
      );
    }
    return {
      results: res.results, //Array of films
      totalResults: res.total_results, //Total number of results,
      totalPages: res.total_pages
    };
  }

  async rateMovies(movieId, rating, sessionId) {
    const baseUrl = `${this.#apiBase}/movie/${movieId}/rating`;
    const queryParams = `guest_session_id=${sessionId}&api_key=${this.#apiKey}`;
    const url = `${baseUrl}?${queryParams}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: rating,
      }),
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`Could not fetch ${baseUrl}, received ${res.status}`);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  }

  // async getRatedMovies(page = 1, sessionId) {
  //   const url = `${
  //     this.#apiBase
  //   }/guest_session/${sessionId}/rated/movies?api_key=${
  //     this.#apiKey
  //   }&page=${page}`;

  //   try {
  //     const response = await fetch(url);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (!data || !data.results) {
  //       console.warn("No rated movies found for this session.");
  //       return []; // Return an empty array if no results found
  //     }

  //     return data.results;
  //   } catch (error) {
  //     console.error("Error fetching rated movies:", error);
  //     // Handle the error here, e.g., display an error message to user
  //   }
  // }

  async getRatedMovies( sessionId) {
    const url = `${
      this.#apiBase
    }/guest_session/${sessionId}/rated/movies?api_key=${
      this.#apiKey
    }`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if(!sessionId) {
        console.log(`нет id гостевой сессии`)
      }

      const data = await response.json();

      if (!data || !data.results) {
        console.warn("No rated movies found for this session.");
        return []; // Return an empty array if no results found
      }

      return data.results;
    } catch (error) {
      console.error("Error fetching rated movies:", error);
      // Handle the error here, e.g., display an error message to user
    }
  }

  async getGenresMovies() {
    const url = `${this.#apiBase}/genre/movie/list?api_key=${this.#apiKey}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`Could not fetch ${url}, received ${res.status}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      //Handling fetch errors
      console.error("Fetch error:", error);
      if (error instanceof TypeError) {
        throw new Error(
          "No internet connection or failed to connect to the server. Please check your network settings."
        );
      }
      throw new Error("Failed to fetch data. Please try again later.");
    }
  }
}
