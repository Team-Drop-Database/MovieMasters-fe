import Constants from "@/utils/Constants"

export type MovieListResponse = {
  page: number,
  results: MovieListItemResponse[],
}

export type MovieListItemResponse = {
  backdrop_path: string,
  genre_ids: number[],
  id: number,
  original_title: string,
  poster_path: string,
}

export type MovieListItemProps = {
  title: string
  posterUrl: string
}

export function mapMovieListToProps(response: MovieListResponse): MovieListItemProps[] {
  return response.results.map(mapToMovieListItemProps)
}

export function mapToMovieListItemProps(response: MovieListItemResponse): MovieListItemProps {
  return {
    title: response.original_title,
    posterUrl: `${Constants.TMDB_POSTER_PATH_BASE}${response.poster_path}`,
  }
}
