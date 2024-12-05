"use server"

import Movie from "@/models/Movie"
import Constants from "@/utils/Constants";
import { mapMovieListToProps, MovieListItemProps, MovieListResponse } from "@/utils/mapper/MovieResponseMaps";

export async function getMovieById(movieId: number): Promise<Movie | string> {
  try {
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/movies/${movieId}`);

    let movie: Movie;
    let message: string;
    switch(response.status) {
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

export async function getTrendingMovies(): Promise<MovieListItemProps[]> {
  const language = "en-US"
  const page = 1
  const url = `${Constants.TMDB_BASE_URL}${Constants.TMDB_API_VERSION}/movie/popular?language=${language}&page=${page}`
  const response = await fetch(url, {
    method: "GET",
    headers: { 
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
  })

  const resBody: MovieListResponse = await response.json()
  return mapMovieListToProps(resBody)
}
