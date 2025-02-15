'use client';
import ElementTransition from "@/components/generic/transitions/ElementTransition";
import React, {useEffect, useState} from 'react';
import WatchlistItem from "@/models/WatchListItem";
import {retrieveWatchlistByUser} from "@/services/WatchListService";
import Link from "next/link";
import {useAuthContext} from "@/contexts/AuthContext";
import Loading from "@/components/generic/Loading";

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
  const [watchlistLoaded, setWatchlistLoaded] = useState<boolean>(false);
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
          const data = await retrieveWatchlistByUser(userId);
          setWatchlist(data);
          setWatchlistLoaded(true);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    void fetchWatchlist();
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
  if (!watchlistLoaded) {
    pageContent = (
      <Loading/>
    );
  } else {
    pageContent = (
      <ElementTransition startYState={50}>
        <div>
          <div className="p-4">
            <h1 className="text-2xl">Watched</h1>
            <div className="flex gap-5 mt-2 py-4 items-start flex-wrap">
              {watchedMovies.length == 0 ? <p className="font-inter text-md opacity-50">Still empty here...</p> : ''}
              {mapMoviesToList(watchedMovies)}
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-2xl">Planned to watch</h1>
            <div className="flex gap-5 mt-2 py-4 items-start flex-wrap">
              {planToWatchMovies.length == 0 ? <p className="font-inter text-md opacity-50">Still empty here...</p> : ''}
              {mapMoviesToList(planToWatchMovies)}
            </div>
          </div>
        </div>
      </ElementTransition>
    );
  }

  // Determines the header based on whether this is your own page 
  // or that of another user such as a friend
  let pageheader;
  if(username){
    pageheader = <h1 className="mb-3">Watchlist of {username}</h1>
  }else{
    pageheader = <h1 className="mb-3">My Watchlist</h1>
  }

  return (
    <div
      className="flex flex-col items-left pb-10 px-10
         font-[family-name:var(--font-alatsi)]"
    >
      {pageheader}
      {pageContent}
    </div>
  );
}
