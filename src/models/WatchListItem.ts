import Movie from "./Movie";
import { WatchListReview } from "./Review";

/**
 * Represents an item on a users' WatchList.
 */
export type WatchlistItem = {
  id: number;
  movie: Movie;
  watched: boolean;
  review: WatchListReview | null;
}

export default WatchlistItem;
