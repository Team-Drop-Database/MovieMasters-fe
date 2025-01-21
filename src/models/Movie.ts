/**
 * Represents a Movie object.
 */
export type Movie = {
  id: number;
  tmdbId: number | null;
  title: string;
  description: string;
  language: string;
  releaseDate: Date;
  tmdbRating: number;
  posterPath: string;
}

export default Movie;