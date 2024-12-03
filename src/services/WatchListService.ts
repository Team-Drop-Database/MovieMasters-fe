import WatchlistItem from "@/models/WatchListItem";
import apiClient from "@/services/ApiClient";

/**
 * Retrieves the watchlist of a given user
 * by fetching the backend API.
 *
 * @param userId id of a user
 * @returns Promise containing a list
 * of WatchlistItems
 */
export default async function retrieveWatchlistByUser(userId: number): Promise<WatchlistItem[]> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/users/${userId}/watchlist`;
    return apiClient(url);
}