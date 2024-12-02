import Image from "next/image";
import Movie from "@/models/Movie"
import getMovieById from "@/services/MovieService";

export default async function Movies({params}: {
  params: Promise<{id: number}>
}) {
  const { id } = await params;
  const movieId: number = id;

  if (isNaN(movieId)) {
    return <div>The movie ID must be a number.</div>;
  }

  const movie: Movie | string = await getMovieById(movieId);
  if (typeof movie === "string") {
    return <div>{movie}</div>;
  }

  return (
    <div className="flex mx-10 my-5 space-x-20">
      <div className="">
        <div className="text-4xl mb-5">{movie.title}</div>
        <Image src={movie.posterPath} alt={movie.title} width="300" height="300"/>
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
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl
         hover:shadow-xl shadow:blue outline hover:ring-2  outline-1 outline-blue-600
          hover:bg-blue-400 transition-all">Add to my watchlist</button>
        <div>
        </div>
      </div>
    </div>
  );
}