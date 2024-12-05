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

/**
 * Adds a movie to a users' watchlist.
 * 
 * @param userId id of the user
 * @param movieId id of the movie
 * @returns enum representing the new watched-state 
 * of the user and the movie
 */
export async function addToWatchlist(userId: number, movieId: number): Promise<WatchedState> {
    const QUERY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process
        .env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist/add/${movieId}`;

    try {
        await fetch(QUERY_URL, {method: 'PUT'});
            
        // When adding an item to the watchlist, default
        // behaviour is to set it to unwatched
        return WatchedState.UNWATCHED;
    } catch(error: unknown) {
        if (error instanceof Error)
            console.error(`Failed to update data using query: ${
                QUERY_URL}.\nError message: ${error.message}`)
        return WatchedState.ERROR;
    }
}

/**
 * Removes a movie from a users' watchlist.
 * 
 * @param userId id of the user
 * @param movieId id of the movie
 * @returns enum representing the new watched-state 
 * of the user and the movie
 */
export async function removeFromWatchlist(userId: number, movieId: number): Promise<WatchedState> {
    const QUERY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process
        .env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist/remove/${movieId}`;

    try {
        await fetch(QUERY_URL, {method: 'PUT'});
        return WatchedState.NOT_WATCHLISTED;
    } catch(error: unknown) {
        if (error instanceof Error)
            console.error(`Failed to update data using query: ${
                QUERY_URL}.\nError message: ${error.message}`)
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
    const QUERY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process
        .env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist/update/${
            movieId}?watched=${watched == WatchedState.WATCHED ? 'true' : 'false'}`;
    try {
        const response = await fetch(QUERY_URL, {method: 'PUT'});
        const data = await response.json();
        const hasWatched = data.association_object.watched;
        return hasWatched ? WatchedState.WATCHED : WatchedState.UNWATCHED;
    } catch(error: unknown) {
        if (error instanceof Error)
            console.error(`Failed to update data using query: ${
                QUERY_URL}.\nError message: ${error.message}`)
        return WatchedState.ERROR;    
    }
}