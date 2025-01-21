import Genre from "@/models/Genre";
import Movie from "@/models/Movie"
import MovieList from "@/models/MovieList";
import apiClient from "@/services/ApiClient";

export async function getMovieById(movieId: number): Promise<Movie | string> {
  try {
    const endpoint = `/movies/${movieId}`
    const response: Response = await apiClient(endpoint);

    let movie: Movie;
    let message: string;
    switch (response.status) {
      case 200: {
        movie = await response.json();
        return movie;
      }
      case 404: {
        message = "Could not find movie with ID: " + movieId;
        console.warn(message);
        return message;
      }
      default: {
        message = "Something went wrong while trying to get the movie with ID: " + movieId;
        console.warn(message);
        return message;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    return "Something went wrong while trying to get the movie with ID: " + movieId;
  }
}

export async function getMovieByTitle(movieTitle: string | null, page: number): Promise<Movie[]> {
  const endpoint = `/movies?title=${movieTitle}&page=${page}`

  try {
    const response: Response = await apiClient(endpoint);

    switch (response.status) {
      case 200: {
        return await response.json();
      }
      default: {
        return [];
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

export async function getNumberOfPages(movieTitle: string | null): Promise<number> {
  movieTitle = movieTitle === null ? '' : movieTitle;
  const endpoint = `/movies/pages?title=${movieTitle}`

  try {
    const response: Response = await apiClient(endpoint);

    switch (response.status) {
      case 200: {
        return await response.json();
      }
      default: {
        return 0;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

export async function postMovie(movie: Movie): Promise<Movie> {
  try {
    const response = await apiClient('/movies', {
      method: 'POST',
      body: JSON.stringify(movie)
    })

    if (response.status === 200 || response.status === 208) {
      return await response.json();
    }
    throw new Error("Could not create movie");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Retrieves all movie genres.
 */
export async function getMovieGenres(): Promise<Genre[]> {
  const endpoint = `/movies/genres`;

  try {
    const response: Response = await apiClient(endpoint);

    switch (response.status) {
      case 200: {
        return await response.json();
      }
      default: {
        return [];
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Retrieves all movies based on a list of genres.
 *
 * @param genres list of genre names
 */
export async function getMoviesByGenre(genres: string[]): Promise<Movie[]> {
  let queryString = `?`;

  // Constructs the querystring
  for(let i = 0; i < genres.length; i++) {
    queryString = queryString + ( i > 0 ? `&` : ``) + `genres=${genres[i]}`;
  }

  const endpoint = `/movies/genrefilter${queryString}`;

  try {
    const response: Response = await apiClient(endpoint);

    switch (response.status) {
      case 200: {
        return await response.json();
      }
      default: {
        return [];
      }
    }
  } catch(error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Retrieves a list of lists of movies where each list has its genre
 * included in it. This mostly utilizes the 'getMoviesByGenre'
 * method and is meant to make it easy to use.
 *
 * @param genres list of genre names
 * @returns list of MovieList objects
 */
export async function getMovieListByGenres(genres: string[]): Promise<MovieList[]> {
  return await Promise.all(
    genres.map(async (genre) => {
      const movies = await getMoviesByGenre([genre]);
      return {genre, movies};
    })
  );
}