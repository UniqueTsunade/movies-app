export default class MoviesGuestSession {
    #apiBase = "https://api.themoviedb.org/3";
    #apiKey = "a0f2f3570d1fbaf0db0cd04feba6ba67";

    async createGuestSession() {
        const apiUrl = `${this.#apiBase}/authentication/guest_session/new`;
        const params = new URLSearchParams({
          api_key: this.#apiKey,
        }).toString();
        const fullUrl = `${apiUrl}?${params}`;
    
        try {
          const res = await fetch(fullUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          //Check response status
          if (!res.ok) {
            const errorMessage = `Could not create guest session, received status: ${res.status}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
          }
          return await res.json();
        } catch (error) {
          //Handling Network Errors
          if (error instanceof TypeError) {
            throw new Error(
              "No internet connection or failed to connect to the server. Please check your network settings."
            );
          }
          //Log other errors
          console.error("Network or fetch error: ", error);
          throw new Error("Failed to create guest session. Please try again later.");
        }
      }
}