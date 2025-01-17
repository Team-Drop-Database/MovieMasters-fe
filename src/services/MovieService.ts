import Movie from "@/models/Movie"
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

export async function postMovie(movie: Movie): Promise<boolean | string> {
  try {
    const response = await apiClient('/movies', {
      method: 'POST',
      body: JSON.stringify(movie)
    })

    if (response.status === 200) {
      return true;
    }
    return await response.text();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}
