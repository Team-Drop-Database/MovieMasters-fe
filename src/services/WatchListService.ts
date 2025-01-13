import WatchlistItem from "@/models/WatchListItem";
import apiClient from "@/services/ApiClient";

/**
 * API Service containing async methods for
 * watchlist-related database operations.
 */

/**
 * Enum representing the current
 * state of a user and a movie.
 */
export enum WatchedState {
  NOT_WATCHLISTED = 'NOT_WATCHLISTED',
  WATCHED = 'WATCHED',
  UNWATCHED = 'UNWATCHED',
  ERROR = 'ERROR'
}

/**
 * Retrieves the watchlist of a given user
 * by fetching the backend API.
 *
 * @param userId id of a user
 * @returns Promise containing a list
 * of WatchlistItems
 */
export async function retrieveWatchlistByUser(userId: number): Promise<WatchlistItem[]> {
  const endpoint = `/users/${userId}/watchlist`

  try {
    return (await apiClient(endpoint)).json();
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to fetch data using query: ${
        endpoint}.\nError message: ${error.message}`)
    throw error;
  }
}

/**
 * Get a specific watchlist item from a user by the user and movie id
 * @param userId id of the user
 * @param movieId id of the movie
 * @returns Promise containing the watchlist item or null
 */
export async function getWatchlistItemFromUser(userId: number, movieId: number): Promise<WatchlistItem | null> {
  const endpoint = `/users/${userId}/watchlist/movie/${movieId}`

  try {
    const response: Response = await apiClient(endpoint);

    if (response.status === 200) {
      return await response.json();
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to fetch data using query: ${
        endpoint}.\nError message: ${error.message}`)
    throw error;
  }
}

/**
 * Retrieve the state of a users relation with a movie.
 * This is in 'WatchedState' form.
 *
 * @param userId id of a user
 * @param movieId id of a movie
 * @returns Promise containing the state of whether
 * the user has a movie on his watchlist
 */
export async function getWatchedStatus(userId: number, movieId: number): Promise<WatchedState> {

  // Fetch the watchlist first
  let watchlistItem: WatchlistItem | null;
  try {
    watchlistItem = await getWatchlistItemFromUser(userId, movieId);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to lookup 'getWatchedStatus' data
        for user userId '${userId}' and movieId '${movieId
      }'.\nError message: ${error.message}.`);
    return WatchedState.ERROR;
  }

  if (!watchlistItem)
    return WatchedState.NOT_WATCHLISTED;

  // Return the result
  return watchlistItem.watched ?
    WatchedState.WATCHED : WatchedState.UNWATCHED;
}

/**
 * Adds a movie to a users' watchlist.
 *
 * @param userId id of the user
 * @param movieId id of the movie
 * @returns enum representing the new watched-state
 * of the user and the movie
 */
export async function addToWatchlist(userId: number, movieId: number): Promise<WatchedState> {
  const endpoint = `/users/${userId}/watchlist/add/${movieId}`

  try {
    await apiClient(endpoint, {method: 'PUT'});

    // When adding an item to the watchlist, default
    // behaviour is to set it to unwatched
    return WatchedState.UNWATCHED;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to update data using query: ${
        endpoint}.\nError message: ${error.message}`)
    return WatchedState.ERROR;
  }
}

/**
 * Updates the watched/unwatched status that a user
 *  has with a movie. The 'watched' property will
 * essentially be updated by this method.
 *
 * @param userId id of a user
 * @param movieId id of a movie
 * @param watched whether the user has watched this
 * movie or not
 * @returns enum representing the new watched-state
 * of the user and the movie
 */
export async function updateWatchedStatus(userId: number, movieId: number, watched: WatchedState): Promise<WatchedState> {
  const endpoint = `/users/${userId}/watchlist/update/${movieId}?watched=${watched == WatchedState.WATCHED
    ? 'true' : 'false'}`;
  try {
    const response = await (apiClient(endpoint, {method: 'PUT'}));
    const data = await response.json();
    const hasWatched = data.association_object.watched;
    return hasWatched ? WatchedState.WATCHED : WatchedState.UNWATCHED;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to update data using query: ${
        endpoint}.\nError message: ${error.message}`)
    return WatchedState.ERROR;
  }
}