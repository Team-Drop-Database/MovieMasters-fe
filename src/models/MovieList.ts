import Movie from "./Movie"

/**
 * Represents a list of movies under a certain genre.
 */
export type MovieList = {
    genre: string,
    movies: Movie[]
}

export default MovieList;