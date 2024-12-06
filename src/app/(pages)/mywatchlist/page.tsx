import WatchlistItem from "@/models/WatchListItem";
import { retrieveWatchlistByUser } from "@/services/WatchListService";
import Link from "next/link";
import {getToken} from "@/utils/tokenUtils";

/**
 * Displays an overview of the movies that a specific user has
 * added on his watchlist, divided into 'Plan to watch' and
 * 'Watched' categories.
 *
 * @returns JSX markup displaying the page.
 */
export default async function MyWatchList() {

    // TODO: Change this later to id from logged in user
    const TEMP_USER_ID = 10;

    // Retrieve this user's watchlist, containing all the movies that he's added
    let watchlist: WatchlistItem[];
    try{
        watchlist = await retrieveWatchlistByUser(TEMP_USER_ID, getToken());
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <p>Failed to fetch data. Error: {error.message}</p>;
        } else {
            return <p>Failed to fetch data. Unknown error occurred.</p>;
        }
    }

    // Divide the list of movies into watched and unwatched
    const watchedMovies = watchlist.filter((item: WatchlistItem) => item.watched);
    const planToWatchMovies = watchlist.filter((item: WatchlistItem) => !item.watched);

    // Returns a list of movies in JSX format
    const mapMoviesToList = (items: WatchlistItem[]) => {

        // Set movie description to max 175 characters
        const DESCRIPTION_MAX_CHARS = 175;

        return items.map((item: WatchlistItem, index: number) => {

            // Construct movie description for when the user hovers over 
            // a movie. Make sure to cut it off at the max-length.
            let description = item.movie.description;
            if (description.length > DESCRIPTION_MAX_CHARS) {
                description = `${description.substring(0, DESCRIPTION_MAX_CHARS)}...`;
            }

            // Construct message about what the user has rated
            let ratingMessage;
            if (item.watched && item.review) {
                ratingMessage = <h5 className="text-xs opacity-50">You rated it: {item.review.rating} Stars</h5>;
            } else if (item.watched) {
                ratingMessage = <h5 className="text-xs opacity-50 w-[80%] text-center 
                text-blue-500 hover:underline">Review this movie</h5>;
            } else {
                ratingMessage = '';
            }

            // Return the movie widget including information such as the 
            // description, TMDB rating and possibly the users' own rating
            return <Link className="flex flex-col items-center max-w-[185px] cursor-pointer"
                         key={index} href={`/movies/${item.movie.id}`}>
                <div className=" w-full h-full relative group">
                    <img className="object-cover w-[185px] aspect-[2/3]" src={item.movie.posterPath}
                         alt={`${item.movie.title}_thumbnail.png`}/>
                    <div className="group-hover:opacity-75 transition-opacity opacity-0 absolute
                     top-0 left-0 bg-black h-full w-full flex justify-evenly items-center flex-col">
                        <p className="text-center text-sm w-[90%]">{description}</p>
                        <p className="text-center text-sm">TMDB Rating: <span
                          className="text-blue-500">{item.movie.tmdbRating}</span></p>
                    </div>
                </div>
                <h3 className="text-l mt-2 text-center">{item.movie.title}</h3>

                {/* Show your rating as well if you've watched it (and reviewed it)*/}
                { ratingMessage }

            </Link>});
    }

    // If page content is empty, show it on the screen. Otherwise, show the lists of movies.
    let pageContent;
    if(watchlist.length === 0) {
        pageContent =
          <div>
              <h2 className="text-3xl">Still empty here...</h2>
              <p>Add some movies to make them show up here!</p>
          </div>
    }
    else {
        // Display both the watched and unwatched movies in separate sections
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
        )
    }

    // Finally, return the content
    return (
      <div className="flex flex-col items-left py-10 px-10 bg-background_secondary
        min-h-[1000px] font-[family-name:var(--font-alatsi)]">
          {pageContent}
      </div>
    );
}