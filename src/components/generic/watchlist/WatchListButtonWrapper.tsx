import { useEffect, useState } from 'react';
import { getWatchedStatus, WatchedState } from "@/services/WatchListService";
import AddToWatchListButton from "./AddToWatchListButton";

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
    }
}) {
    const [watchedStatus, setWatchedStatus] = useState<WatchedState>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWatchedStatus = async () => {
            try {
                const status = await getWatchedStatus(params.userId, params.movieId);
                setWatchedStatus(status);
            } catch (error) {
                console.error("Error fetching watched status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchedStatus();
    }, [params.userId, params.movieId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
      <AddToWatchListButton
        params={{
            initialWatchedStatus: watchedStatus,
            userId: params.userId,
            movieId: params.movieId
        }}
      />
    );
}
