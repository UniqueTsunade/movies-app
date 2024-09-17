export default class MoviesCollection {
  #apiBase = "https://api.themoviedb.org/3";
  #apiKey = "a0f2f3570d1fbaf0db0cd04feba6ba67";

  async getResource(url, query, page) {
    const apiUrl = `${this.#apiBase}${url}`;
    
    const params = new URLSearchParams({
      api_key: this.#apiKey,
      query: query,
      page: page,
    }).toString();
    
    const fullUrl = `${apiUrl}?${params}`;

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

    async getMovies(title, page = 1) {
      const res = await this.getResource("/search/movie", title, page); 
      console.log(res)
      return {
        results: res.results, //Array of films
        totalResults: res.total_results, //Total number of results
      };
    }  
}

