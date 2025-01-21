"use server"
import Constants from "@/utils/Constants";
import {mapMovieListToProps, MovieListItemProps, MovieListResponse} from "@/utils/mapper/MovieResponseMaps";
import Movie from "@/models/Movie";

const baseTmdbMovieUrl = `${Constants.TMDB_BASE_URL}${Constants.TMDB_API_VERSION}/movie`;
const language = 'en-US';

export async function getTrendingMovies(): Promise<MovieListItemProps[]> {
  const page = 1
  const url = `${baseTmdbMovieUrl}/popular?language=${language}&page=${page}`
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

export async function getMovieById(movieId: number): Promise<Movie | string> {
  try {
    const url = `${baseTmdbMovieUrl}/${movieId}?language=${language}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    })
    if (response.status === 200) {
      const tmdbMovie = await response.json();

      return {
        id: tmdbMovie.id,
        title: tmdbMovie.original_title,
        description: tmdbMovie.overview,
        releaseDate: tmdbMovie.release_date,
        language: tmdbMovie.original_language,
        tmdbRating: tmdbMovie.vote_average,
        mmAvgRating: null,
        posterPath: 'https://image.tmdb.org/t/p/original' + tmdbMovie.poster_path
      };
    } else {
      const result = await response.json();
      return result.status_message;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}