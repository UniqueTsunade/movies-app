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

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        console.error(`Could not fetch ${baseUrl}, received ${res.status}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
       //Handling Network Errors
      if (error instanceof TypeError) {
        throw new Error(
          "No internet connection or failed to connect to the server. Please check your network settings."
        );
      }
        //Log other errors
        console.error("An error occurred: ", error);
        throw new Error("Failed to rate the movie. Please try again later.");
    }
  }

  async getRatedMovies(sessionId) {
    const url = `/guest_session/${sessionId}/rated/movies`; 
    const params = { api_key: this.#apiKey }; 

    try {
        const data = await this.getResource(url, params); 

        if (!data || !data.results) {
            console.warn("No rated movies found for this session.");
            return []; 
        }

        console.log("Метод getRatedMovies был вызван")  
        return data.results; 
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No internet connection or failed to connect to the server. Please check your network settings."
            );
        }
        console.error("Error fetching rated movies:", error);
        return []; 
    }
}


  async getGenresMovies() {
    const url = "/genre/movie/list"; 
    try {
        const data = await this.getResource(url);
        return data; 
    } catch (error) {
        console.error("Error getting movie genres:", error);
        throw new Error("Failed to get movie genres. Please try again later.");
    }
}
}
