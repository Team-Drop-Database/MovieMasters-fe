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
export default async function WatchListButtonWrapper({params}: {
    params: {
        userId: number,
        movieId: number
    }
}) {

    // Query database whether the user has watchlisted and/or watched this movie
    let watched: WatchedState = await getWatchedStatus(params.userId, params.movieId);

    // Render the client-side component
    return <AddToWatchListButton params={{
        initialWatchedStatus: watched,
        userId: params.userId,
        movieId: params.movieId
    }}></AddToWatchListButton>
}