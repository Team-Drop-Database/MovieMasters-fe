'use client'

import { addToWatchlist, removeFromWatchlist, updateWatchedStatus, WatchedState } from "@/services/WatchListService";
import { useState } from "react";

export default function AddToWatchListButton({params}: {
  params : {
    initialWatchedStatus: WatchedState,
    userId: number,
    movieId: number,
  }
}) {

  // Extract the ids
  const userId = params.userId;
  const movieId = params.movieId;

  // Set up 'watchStatus' as a reactive variable
  const [watchStatus, setWatchStatus] = useState(params.initialWatchedStatus);

  // Handler for adding a movie to the users watchlist
  const handleAddMovieToWatchlist = async () => {
    const newWatchStatus: WatchedState = await addToWatchlist(userId, movieId);
    setWatchStatus(newWatchStatus);
  }

  const handleRemoveMovieFromWatchlist = async () => {

    const newWatchStatus: WatchedState = await removeFromWatchlist(userId, movieId);
    setWatchStatus(newWatchStatus);

    console.log("Removed from watchlist");
  }

  const handleChangeWatchedStatus = async (status: WatchedState) => {
    setWatchStatus(status);
    const newWatchStatus: WatchedState = await updateWatchedStatus(userId, movieId, status);
    setWatchStatus(newWatchStatus);
  }

  if (watchStatus == WatchedState.ERROR) {
    return <p className="mt-4 text-red-500">Something went wrong. Please try again later.</p>;
  }

  // Show a button if not watchlisted
  if (watchStatus == WatchedState.NOT_WATCHLISTED) {
    return <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl
    hover:shadow-xl shadow:blue outline hover:ring-2  outline-1 outline-blue-600
     hover:bg-blue-400 transition-all" onClick={handleAddMovieToWatchlist}>Add to my watchlist</button>;
  }

  return (<div className="mt-4">
            <p>On your watchlist (vinkje). <a onClick={handleRemoveMovieFromWatchlist}>
              <span className="text-blue-400 hover:underline cursor-pointer font-extralight text-sm">Remove</span></a></p>
            <select id="selectWatchedStatus" name="SelectWatchedStatus" 
                className="mt-2 px-4 py-2 bg-blue-500 rounded-md text-white font-semibold" 
                value={watchStatus} 
                onChange={event => handleChangeWatchedStatus(event.target.value as WatchedState)}>
              <option value={WatchedState.UNWATCHED}>Plan to watch</option>
              <option value={WatchedState.WATCHED}>Watched</option>
            </select>
          </div>);
}