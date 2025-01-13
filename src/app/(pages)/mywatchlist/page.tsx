'use client';
import ElementTransition from "@/components/generic/transitions/ElementTransition";
import React, {useEffect, useState} from 'react';
import WatchlistItem from "@/models/WatchListItem";
import {retrieveWatchlistByUser} from "@/services/WatchListService";
import Link from "next/link";
import {useAuthContext} from "@/contexts/AuthContext";

import { useSearchParams } from 'next/navigation';

/**
 * Displays an overview of the movies that a specific user has
 * added on his watchlist, divided into 'Plan to watch' and
 * 'Watched' categories.
 *
 * @returns JSX markup displaying the page.
 */
export default function MyWatchList() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userDetails } = useAuthContext();

  const searchParams = useSearchParams();

  const [username, setUsername] = useState<string | null>('');

  useEffect(() => {

    async function fetchWatchlist() {
      try {
        if (userDetails) {
          const queryUserid = searchParams.get('userid');
          const userId = (queryUserid ? queryUserid : userDetails?.userId) as number;

          setUsername(searchParams.get('name'));
          console.log(username);
          const data = await retrieveWatchlistByUser(userId);
          setWatchlist(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    fetchWatchlist();
  }, [userDetails, searchParams]);

  // Divide the list of movies into watched and unwatched
  const watchedMovies = watchlist.filter((item) => item.watched);
  const planToWatchMovies = watchlist.filter((item) => !item.watched);

  const mapMoviesToList = (items: WatchlistItem[]) => {
    const DESCRIPTION_MAX_CHARS = 175;

    return items.map((item, index) => {
      let description = item.movie.description;
      if (description.length > DESCRIPTION_MAX_CHARS) {
        description = `${description.substring(0, DESCRIPTION_MAX_CHARS)}...`;
      }

      let ratingMessage;
      if (item.watched && item.review) {
        ratingMessage = (
          <h5 className="text-xs opacity-50">
            You rated it: {item.review.rating}/10
          </h5>
        );
      } else if (item.watched) {
        ratingMessage = (
          <h5 className="text-xs opacity-80 w-[80%] text-center text-blue-500 hover:underline">
            Review this movie
          </h5>
        );
      } else {
        ratingMessage = null;
      }

      return (
        <Link
          className="flex flex-col items-center max-w-[185px] cursor-pointer"
          key={index}
          href={`/movies/${item.movie.id}`}
        >
          <div className="w-full h-full relative group">
            <img
              className="object-cover w-[185px] aspect-[2/3]"
              src={item.movie.posterPath}
              alt={`${item.movie.title}_thumbnail.png`}
            />
            <div
              className="group-hover:opacity-75 transition-opacity opacity-0 absolute
                     top-0 left-0 bg-black h-full w-full flex justify-evenly items-center flex-col"
            >
              <p className="text-center text-sm w-[90%]">{description}</p>
              <p className="text-center text-sm">
                TMDB Rating:{' '}
                <span className="text-blue-500">{item.movie.tmdbRating}</span>
              </p>
            </div>
          </div>
          <h3 className="text-l mt-2 text-center">{item.movie.title}</h3>
          {ratingMessage}
        </Link>
      );
    });
  };

  if (error) {
    return <p>Failed to fetch data. Error: {error}</p>;
  }

  let pageContent;
  if (watchlist.length === 0) {
    pageContent = (
      <div>
        <h2 className="text-2xl">Still empty here...</h2>
        <p>Add some movies to make them show up here!</p>
      </div>
    );
  } else {
    pageContent = (
      <ElementTransition startYState={50}>
        <div>
          <div className="p-4">
            <h1 className="text-2xl">Watched</h1>
            <div className="flex gap-5 mt-2 py-4 items-start flex-wrap">
              {mapMoviesToList(watchedMovies)}
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-2xl">Plan to watch</h1>
            <div className="flex gap-5 mt-2 py-4 items-start flex-wrap">
              {mapMoviesToList(planToWatchMovies)}
            </div>
          </div>
        </div>
      </ElementTransition>
    );
  }

  return (
    <div
      className="flex flex-col items-left pb-10 px-10
         font-[family-name:var(--font-alatsi)]"
    >
        <h1 className="mb-3">Watchlist{username ? ' of ' + username : ''}</h1>
      {pageContent}
    </div>
  );
}
