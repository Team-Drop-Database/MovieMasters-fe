import WatchlistItem from "@/models/WatchListItem";

export enum WatchedState {
    WATCHED,
    UNWATCHED,
    ERROR
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
    const QUERY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist`;

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

export async function hasWatched(userId: number, movieId: number): Promise<WatchedState> {

    // Fetch the watchlist first
    let watchlist: WatchlistItem[];
    try {
        watchlist = await retrieveWatchlistByUser(userId);
    } catch(error: unknown) {
        if (error instanceof Error)
            console.error(`Failed to lookup 'hasWatched' data 
        for user userId '${userId}' and movieId '${movieId
            }'.\nError message: ${error.message}.`);
        return WatchedState.ERROR;
    }

    // Filter on the movieId, check whether its in the list of movies
    const includesMovie = watchlist
        .filter((item) => item.movie.id == movieId);
    const watched = includesMovie.length > 0 ? 
        WatchedState.WATCHED : WatchedState.UNWATCHED;

    // Return the result
    return watched;
}