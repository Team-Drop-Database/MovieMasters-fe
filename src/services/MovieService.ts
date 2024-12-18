﻿import Movie from "@/models/Movie"
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

export async function getMovieByTitle(movieTitle: string): Promise<Movie[] | string> {
  try {
    const endpoint = `/movies?title=${movieTitle}`
    const response: Response = await apiClient(endpoint);

    let movies: Movie[];
    let message: string;
    switch (response.status) {
      case 200: {
        movies = await response.json();
        return movies;
      }
      case 404: {
        message = "Could not find movies with titles containing: " + movieTitle;
        console.warn(message);
        return message;
      }
      default: {
        console.log(response.status);
        message = "Something went wrong while trying to get movies containing title: " + movieTitle;
        console.warn(message);
        return message;
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    } else {
      return "Something went wrong while trying to get movies containing title: " + movieTitle;
    }
  }
}