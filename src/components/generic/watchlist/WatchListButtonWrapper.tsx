import { useEffect, useState } from 'react';
import {getWatchlistItemFromUser, WatchedState} from "@/services/WatchListService";
import AddToWatchListButton from "./AddToWatchListButton";
import WatchlistItem from "@/models/WatchListItem";

/**
 * Server-side wrapper-component for the client-side
 * 'AddToWatchListButton' component. The goal of this
 * component is to fetch some initial watchlist data
 * on the server side, and then be able to immediately
 * pass it to AddToWatchListButton when client-side
 * rendering begins.
 */
export default function WatchListButtonWrapper({ params }: {
    params: {
        userId: number,
        movieId: number
        onValueChange?: (newValue: WatchedState) => void,
    }
}) {
    const [watchlistItem, setWatchlistItem] = useState<WatchlistItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWatchedStatus = async () => {
            try {
                setWatchlistItem(await getWatchlistItemFromUser(params.userId, params.movieId));
            } catch (error) {
                console.error("Error fetching watched status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchedStatus().then();
    }, [params.userId, params.movieId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
      <AddToWatchListButton
        params={{
            initialWatchlistItem: watchlistItem,
            userId: params.userId,
            movieId: params.movieId,
            onValueChange: params.onValueChange,
        }}
      />
    );
}
