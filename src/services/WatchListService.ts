import WatchlistItem from "@/models/WatchListItem";

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
};

/**
 * Retrieves the watchlist of a given user 
 * by fetching the backend API.
 * 
 * @param userId id of a user
 * @returns Promise containing a list 
 * of WatchlistItems
 */
export async function retrieveWatchlistByUser(userId: number): Promise<WatchlistItem[]> {
    const QUERY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process
        .env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist`;

    try {
        const response = await fetch(QUERY_URL);
        return response.json();
    } catch(error: unknown) {
        if(error instanceof Error)
            console.error(`Failed to fetch data using query: ${
                QUERY_URL}.\nError message: ${error.message}`)
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
    let watchlist: WatchlistItem[];
    try {
        watchlist = await retrieveWatchlistByUser(userId);
    } catch(error: unknown) {
        if (error instanceof Error)
            console.error(`Failed to lookup 'getWatchedStatus' data 
        for user userId '${userId}' and movieId '${movieId
            }'.\nError message: ${error.message}.`);
        return WatchedState.ERROR;
    }

    // Filter on the movieId, check whether its in the list of movies
    const includesMovie = watchlist
        .filter((item) => item.movie.id == movieId);

    // Is it on his watchlist? If not, return that
    const watchListed = includesMovie.length > 0;
    if(!watchListed)
        return WatchedState.NOT_WATCHLISTED;

    // Otherwise, take the data and check his watched status
    const movieAssociation = includesMovie[0];    
    const hasWatched = movieAssociation.watched ? 
        WatchedState.WATCHED : WatchedState.UNWATCHED;

    // Return the result
    return hasWatched;
}

}