 // async getResource(url, query, page, sessionId) {
  //   const apiUrl = `${this.#apiBase}${url}`;

  //   // const params = new URLSearchParams({
  //   //   api_key: this.#apiKey,
  //   //   query: query,
  //   //   page: page,
  //   // });

  //   // if (sessionId) {
  //   //   params.append("guest_session_id", sessionId)
  //   // }

  //   const params = new URLSearchParams({
  //     api_key: this.#apiKey,
  //     page: page,
  //   });

  //   if (query !== undefined && query !== null) {
  //     params.append("query", query);
  //   }

  //   if (sessionId) {
  //     params.append("guest_session_id", sessionId);
  //   }

  //   const fullUrl = `${apiUrl}?${params.toString()}`;

  //   try {
  //     const res = await fetch(fullUrl);
  //     //Checking the success of the server response
  //     if (!res.ok) {
  //       console.error(`Could not fetch ${apiUrl}, received ${res.status}`);
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }
  //     return await res.json();
  //   } catch (error) {
  //     //Handling fetch errors
  //     console.error("Fetch error:", error);
  //     if (error instanceof TypeError) {
  //       throw new Error(
  //         "No internet connection or failed to connect to the server. Please check your network settings."
  //       );
  //     }
  //     throw new Error("Failed to fetch data. Please try again later.");
  //   }
  // }


    // async getMovies(title, page = 1, sessionId) {
  //   const res = await this.getResource("/search/movie", title, page, sessionId);
  //   console.log(res);
  //   console.log(sessionId);
  //   if (!sessionId) {
  //     console.warn(
  //       "No session ID provided. Results may be limited or authentication may fail."
  //     );
  //   }
  //   return {
  //     results: res.results, //Array of films
  //     totalResults: res.total_results, //Total number of results
  //   };
  // }


    // async getRatedMovies(page = 1, sessionId) {
  //   const apiUrl = `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies`;
  //   const params = new URLSearchParams({
  //     api_key: this.#apiKey,
  //     page: page,
  //   });
  //   const fullUrl = `${apiUrl}?${params.toString()}`;

  //   try {
  //     const res = await fetch(fullUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     });
  //     if (!res.ok) {
  //       console.error(`Error fetching data: ${res.status} ${res.statusText}`);
  //       throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
  //     }
  //     const data = await res.json();
  //     return {
  //       results: data.results, // Array of films
  //       totalResults: data.total_results, // Total number of results
  //     };
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     throw error;
  //   }
  // }
