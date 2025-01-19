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

/**
 * Retrieves all genres.
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
  } catch(error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Retrieves all movies based on a list of genres.
 * 
 * @param genreName name of the genre
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

export async function getMovieListByGenres(genres: string[]): Promise<MovieList[]> {
  const movieLists: MovieList[] = [];
  for(let i = 0; i < genres.length; i++) {
    const movies = await getMoviesByGenre([genres[i]]);
    const movieList: MovieList = {genre: genres[i], movies};
    movieLists.push(movieList);
  }
  return movieLists;
}

// deze functie is wss niet meer nodig
export async function getMovieLists() {
  // get the genres
  // for each genre, get the movies
  // create an array of 'MovieList' objects
  // fill this array, giving 
}

// Dus hoe het gaat werken:
// 1. Haal genres op (dit moet sws om een filter te kunnen toevoegen later)
// 2. Bij de initiele page load: geef alle genres in 1x mee aan 'getMovieListByGenres'
// 3. Bij het filteren later: geef alleen de aangevinkte genres mee aan 'GetMovieListByGenres'

// Nog doen later:
// 1. Voeg meer films toe aan de database (bijv. ook page 2 en 3 van 'top_rated'), voor een grotere explore page
// 2. Maak responsive