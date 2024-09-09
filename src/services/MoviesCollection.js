export default class MoviesCollection {
    #apiBase = "https://api.themoviedb.org/3";
    #apiKey = "a0f2f3570d1fbaf0db0cd04feba6ba67"

    async getResource(url,query) {
        const apiUrl = `${this.#apiBase}${url}`;
        const params = `api_key=${this.#apiKey}&query=${query}`;
        const res = await fetch(`${apiUrl}?${params}`);

        if (!res.ok) {
          throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
        }
    
        return await res.json();
      }

      async getMovies(title) {
        const res = await this.getResource(`/search/movie`, title);
        console.log(res.results)
        return res.results
      }
    
}