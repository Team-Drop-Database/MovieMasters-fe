import AddToWatchListButton from "./AddToWatchListButton";

/**
 * Server-side wrapper-component for the client-side
 * 'AddToWatchListButton' component. The goal of this
 * component is to fetch some initial watchlist data
 * on the server side, and then be able to immediately
 * pass it to AddToWatchListButton when client-side
 * rendering begins.
 */
export default async function WatchListButtonWrapper() {

    
    return <AddToWatchListButton params={params}></AddToWatchListButton>
}