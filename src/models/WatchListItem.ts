import Movie from "./Movie";
import Review from "./Review";

/**
 * Represents an item on a users' WatchList.
 */
export type WatchlistItem = {
    id: number;
    movie: Movie;  
    watched: boolean;
    review: Review;
}

export default WatchlistItem;