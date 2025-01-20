import { useEffect, useState } from 'react';
import {addToWatchlist, getWatchlistItemFromUser, updateWatchedStatus, WatchedState} from "@/services/WatchListService";
import WatchlistItem from "@/models/WatchListItem";
import Image from "next/image";

/**
 * Server-side wrapper-component for the client-side
 * 'AddToWatchListButton' component. The goal of this
 * component is to fetch some initial watchlist data
 * on the server side, and then be able to immediately
 * pass it to AddToWatchListButton when client-side
 * rendering begins.
 */
export default function AddToWatchListButton({ params }: {
  params: {
    userId: number,
    movieId: number
    onValueChange?: (newValue: WatchedState) => void,
    hasReview: boolean | undefined
  }
}) {
  const [watchlistItem, setWatchlistItem] = useState<WatchlistItem | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchedState>(WatchedState.NOT_WATCHLISTED);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasReview, setHasReview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
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

  useEffect((): void => {
    if (watchlistItem === null) {
      setWatchStatus(WatchedState.NOT_WATCHLISTED);
      setHasReview(false);
    } else {
      setHasReview(watchlistItem.review !== null);
      setWatchStatus(watchlistItem.watched ? WatchedState.WATCHED : WatchedState.UNWATCHED);
    }
  }, [watchlistItem]);

  useEffect(() => {
    if (params.onValueChange !== undefined) {
      params.onValueChange(watchStatus)
    }
  }, [watchStatus]);

  useEffect((): void => {
    if (watchlistItem && params.hasReview !== undefined) {
      setHasReview(params.hasReview);
    }
  }, [params.hasReview]);

  const handleAddMovieToWatchlist = async (): Promise<void> => {
    try {
      setLoading(true);
      const newWatchlistItem: WatchlistItem | null = await addToWatchlist(params.userId, params.movieId);

      if (newWatchlistItem !== null) {
        setWatchlistItem(newWatchlistItem);
        setWatchStatus(WatchedState.UNWATCHED)
      }
    } catch (error) {
      console.error("Error adding to watchlist", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWatchedStatus = async (watchedState: WatchedState): Promise<void> => {
    try {
      setLoading(true);
      setWatchStatus(await updateWatchedStatus(params.userId, params.movieId, watchedState));
    } catch (error) {
      console.error("Error updating watched status", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
      {!hasReview && (
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
