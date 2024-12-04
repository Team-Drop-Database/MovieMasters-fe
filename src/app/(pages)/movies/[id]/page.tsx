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


  const movieReleaseYear: string = movie.releaseDate.toString().substring(0, 4);

  return (
    <div className="flex mx-10 my-5 space-x-20 font-sans">
      <div className="flex flex-col gap-5">
        <Image src={movie.posterPath} alt={movie.title} width={300} height={300}/>
      </div>
      <div className="">
        <div className=" mb-5 border-b border-slate-400 border-opacity-10 pb-4">
          <div className="text-4xl font-medium">{movie.title}</div>
          <h5 className="font-semibold opacity-30 text-sm">{movieReleaseYear} - {movie.language.toUpperCase()}</h5>
        </div>
        <div id="movie-ratings" className="flex flex-row space-between justify-between w-1/2 mb-5  border-b border-slate-400 border-opacity-10 pb-4">
          <div>
            <div className="text-2xl">TMDB rating</div>
            <p className="text-2xl font-sans font-semibold">{movie.tmdbRating}</p>
          </div>
          <div>
            <div className="text-2xl">Movie Master rating</div>
            <p className="text-2xl font-sans font-semibold">8.2</p>
          </div>
        </div>
        <div className="border-b border-slate-400 border-opacity-10 pb-4">
          <div className="text-2xl font-semibold">Description</div>
          <p className="font-sans">{movie.description}</p>
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