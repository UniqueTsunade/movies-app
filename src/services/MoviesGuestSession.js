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
          if (!res.ok) {
            console.error(`Could not create guest session, received ${res.status}`);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return await res.json();
        } catch (error) {
          console.error("Fetch error:", error);
          throw new Error("Failed to create guest session. Please try again later.");
        }
      }
}