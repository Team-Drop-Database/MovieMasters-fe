"use server"
import Constants from "@/utils/Constants";
import { mapMovieListToProps, MovieListItemProps, MovieListResponse } from "@/utils/mapper/MovieResponseMaps";

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
