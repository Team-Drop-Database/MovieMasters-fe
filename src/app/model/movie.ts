/**
 * Represents a Movie object.
 */
export type Movie = {
    id: number;
    title: string;
    description: string;
    language: string;
    releaseDate: Date;
    rating: number;
    posterPath: string;
    tmdbRating: number;
}

export default Movie;