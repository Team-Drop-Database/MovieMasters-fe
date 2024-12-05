import Image from "next/image";
import Movie from "@/models/Movie"
import getMovieById from "@/services/MovieService";
import WatchListButtonWrapper from "@/components/generic/watchlist/WatchListButtonWrapper";

export default async function Movies({params}: {
  params: Promise<{id: number}>
}) {
  const { id } = await params;
  const movieId: number = id;

  // Temporarily hardcoded ID of user. Delete later
  // when user ID can be accessed.
  const TEMP_USER_ID = 1;

  if (isNaN(movieId)) {
    return <div>The movie ID must be a number.</div>;
  }

  const movie: Movie | string = await getMovieById(movieId);
  if (typeof movie === "string") {
    return <div>{movie}</div>;
  }

  return (
    <div className="flex mx-10 my-5 space-x-20">
      <div className="flex flex-col gap-5">
        <Image src={movie.posterPath} alt={movie.title} width={300} height={300}/>
        <div className="text-4xl mb-5">{movie.title}</div>
      </div>
      <div className="">
        <div id="movie-ratings" className="flex flex-row space-between justify-between w-1/2 mb-5">
          <div>
            <div className="text-2xl">TMDB rating</div>
            <p className="text-2xl">{movie.tmdbRating}</p>
          </div>
          <div>
            <div className="text-2xl">Movie Master rating</div>
            <p className="text-2xl">8.2</p>
          </div>
        </div>
        <div>
          <div className="text-2xl">Description</div>
          <p>{movie.description}</p>
        </div>
          <WatchListButtonWrapper params={{
          userId: TEMP_USER_ID,
          movieId
        }}></WatchListButtonWrapper>
        <div>
        </div>
      </div>
    </div>
  );
}