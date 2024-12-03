import WatchlistItem from "@/models/WatchListItem";

/**
 * Retrieves the watchlist of a given user 
 * by fetching the backend API.
 * 
 * @param userId id of a user
 * @returns Promise containing a list 
 * of WatchlistItems
 */
export default async function retrieveWatchlistByUser(userId: number): Promise<WatchlistItem[]> {
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