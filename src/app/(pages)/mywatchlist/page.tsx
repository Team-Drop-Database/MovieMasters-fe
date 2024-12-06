'use client';

import { useEffect, useState } from "react";
import WatchlistItem from "@/models/WatchListItem";
import { retrieveWatchlistByUser } from "@/services/WatchListService";
import Link from "next/link";

/**
 * Displays an overview of the movies that a specific user has
 * added to their watchlist, divided into 'Plan to watch' and
 * 'Watched' categories.
 *
 * @returns JSX markup displaying the page.
 */
export default function MyWatchList() {
    // Static user ID for testing purposes
    const TEMP_USER_ID = 10;

    // State for managing the watchlist, loading, and error states
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the watchlist data when the component mounts
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const fetchedWatchlist = await retrieveWatchlistByUser(TEMP_USER_ID);
                setWatchlist(fetchedWatchlist); // Store the fetched watchlist data
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(`Failed to fetch data. Error: ${error.message}`);
                } else {
                    setError('Failed to fetch data. Unknown error occurred.');
                }
            } finally {
                setLoading(false); // Set loading to false after fetch attempt
            }
        };

        fetchWatchlist(); // Call the fetch function
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    // Function to map movies to JSX elements
    const mapMoviesToList = (items: WatchlistItem[]) => {
        const DESCRIPTION_MAX_CHARS = 175;

        return items.map((item: WatchlistItem, index: number) => {
            let description = item.movie.description;
            if (description.length > DESCRIPTION_MAX_CHARS) {
                description = `${description.substring(0, DESCRIPTION_MAX_CHARS)}...`;
            }

            let ratingMessage;
            if (item.watched && item.review) {
                ratingMessage = <h5 className="text-xs opacity-50">You rated it: {item.review.rating} Stars</h5>;
            } else if (item.watched) {
                ratingMessage = <h5 className="text-xs opacity-50 w-[80%] text-center text-blue-500 hover:underline">Review this movie</h5>;
            } else {
                ratingMessage = '';
            }

            return (
              <Link className="flex flex-col items-center max-w-[185px] cursor-pointer" key={index} href={`/movies/${item.movie.id}`}>
                  <div className="w-full h-full relative group">
                      <img className="object-cover w-[185px] aspect-[2/3]" src={item.movie.posterPath} alt={`${item.movie.title}_thumbnail.png`} />
                      <div className="group-hover:opacity-75 transition-opacity opacity-0 absolute top-0 left-0 bg-black h-full w-full flex justify-evenly items-center flex-col">
                          <p className="text-center text-sm w-[90%]">{description}</p>
                          <p className="text-center text-sm">TMDB Rating: <span className="text-blue-500">{item.movie.tmdbRating}</span></p>
                      </div>
                  </div>
                  <h3 className="text-l mt-2 text-center">{item.movie.title}</h3>
                  {ratingMessage}
              </Link>
            );
        });
    };

    // Content rendering based on the state
    let pageContent;
    if (loading) {
        pageContent = <p>Loading...</p>;
    } else if (error) {
        pageContent = <p>{error}</p>;
    } else if (watchlist.length === 0) {
        pageContent = (
          <div>
              <h2 className="text-3xl">Still empty here...</h2>
              <p>Add some movies to make them show up here!</p>
          </div>
        );
    } else {
        const watchedMovies = watchlist.filter((item: WatchlistItem) => item.watched);
        const planToWatchMovies = watchlist.filter((item: WatchlistItem) => !item.watched);

        pageContent = (
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
        );
    }

    return (
      <div className="flex flex-col items-left py-10 px-10 bg-background_secondary min-h-[1000px] font-[family-name:var(--font-alatsi)]">
          {pageContent}
      </div>
    );
}
