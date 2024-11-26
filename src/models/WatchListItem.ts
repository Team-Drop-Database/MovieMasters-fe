import Movie from "./Movie";

/**
 * Represents an item on a users' WatchList.
 */
export type WatchlistItem = {
    id: number;
    movie: Movie;  
    watched: boolean;
    rating: number;
}

export default WatchlistItem;