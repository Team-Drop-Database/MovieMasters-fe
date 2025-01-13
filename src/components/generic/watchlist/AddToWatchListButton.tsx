'use client';

import {addToWatchlist, getWatchlistItemFromUser, updateWatchedStatus, WatchedState} from "@/services/WatchListService";
import {useEffect, useState} from "react";
import Image from "next/image";
import WatchlistItem from "@/models/WatchListItem";

export default function AddToWatchListButton({params}: {
  params : {
    initialWatchedStatus: WatchedState,
    userId: number,
    movieId: number,
    onValueChange?: ((newValue: WatchedState) => void),
  }
}) {

  const userId = params.userId;
  const movieId = params.movieId;

  const [watchStatus, setWatchStatus] = useState<WatchedState>(params.initialWatchedStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchlistItem, setWatchlistItem] = useState<WatchlistItem | null>(null);

  const handleAddMovieToWatchlist = async () => {
    try {
      setLoading(true);
      const newWatchStatus = await addToWatchlist(userId, movieId);
      setWatchStatus(newWatchStatus);
    } catch (error) {
      console.error("Error adding to watchlist", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWatchedStatus = async (status: WatchedState) => {
    try {
      setLoading(true);
      setWatchStatus(status);
      const newWatchStatus = await updateWatchedStatus(userId, movieId, status);
      setWatchStatus(newWatchStatus);
    } catch (error) {
      console.error("Error updating watched status", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.onValueChange !== undefined) {
      params.onValueChange(watchStatus)
    }
  }, [watchStatus])

  useEffect(() => {
    async function getWatchItem() {
      setWatchlistItem(await getWatchlistItemFromUser(userId, movieId));
    }

    getWatchItem().then();
  }, []);

  if (error) {
    return <p className="mt-4 text-red-500">{error}</p>;
  }

  if (watchStatus === WatchedState.NOT_WATCHLISTED) {
    return (
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl
        hover:shadow-xl shadow:blue outline hover:ring-2 outline-1 outline-blue-600
        hover:bg-blue-400 transition-all"
        onClick={handleAddMovieToWatchlist}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to my watchlist"}
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex gap-1 items-end">
        <p className="flex items-center gap-1">
          On your watchlist
          <Image src={'/checkmark.svg'} width={16} height={16} alt="checkmark" />
        </p>
      </div>
      {watchStatus !== WatchedState.WATCHED || watchlistItem?.review === null && (
        <select
          id="selectWatchedStatus"
          name="SelectWatchedStatus"
          className="mt-2 px-4 py-2 bg-blue-500 rounded-md text-white font-semibold"
          value={watchStatus}
          onChange={event => handleChangeWatchedStatus(event.target.value as WatchedState)}
          disabled={loading}
        >
          <option value={WatchedState.UNWATCHED}>Plan to watch</option>
          <option value={WatchedState.WATCHED}>Watched</option>
        </select>
      )}
    </div>
  );
}
