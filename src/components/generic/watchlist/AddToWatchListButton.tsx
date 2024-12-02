'use client'

import { WatchedState } from "@/services/WatchListService";
import { useState } from "react";

export default function AddToWatchListButton({watchedInitially}: {
  watchedInitially: WatchedState
}) {

  // Pak later de default value (nu 'false') uit params. Dit is wat de server initieel laadt.
  const [watched, setWatched] = useState(watchedInitially);

  // Handler for adding a movie to the users watchlist
  const handleAddMovieToWatchlist = () => {

    //TODO: Hier het PUT request om de watched status te updaten
    //const response = watchlistService.addToWatched(userId, movieId);
    
    // Als alles goed ging:
    setWatched(WatchedState.WATCHED);
  }

  // Holds the final JSX For this component
  let watchedWidget;

  // Determine JSX based on watched state
  if (watched == WatchedState.WATCHED) {
    watchedWidget = <p>On your watchlist (vinkje)</p>;
  } else if (watched == WatchedState.UNWATCHED ) {
    watchedWidget = <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl
    hover:shadow-xl shadow:blue outline hover:ring-2  outline-1 outline-blue-600
     hover:bg-blue-400 transition-all" onClick={handleAddMovieToWatchlist}>Add to my watchlist</button>;
  } else {
    watchedWidget = <p className="text-red-500">Something went wrong. Please try again later.</p>
  }
  
  return (<div className="mt-4">
            {watchedWidget}
        </div>);
}