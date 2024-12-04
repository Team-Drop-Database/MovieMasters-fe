/**
 * Represents a Movie object.
 */
export type Movie = {
  id: number;
  title: string;
  description: string;
  language: string;
  releaseDate: Date;
  tmdbRating: number;
  posterPath: string;
}

export default Movie;