import {SearchParams} from "next/dist/server/request/search-params";
import Movie from "@/models/Movie";
import {getMovieByTitle} from "@/services/MovieService";
import NotFound from "next/dist/client/components/not-found-error";
import Image from "next/image";


export default async function Search({ searchParams } : {searchParams: SearchParams}) {
  const { title } = searchParams;
  if (title === undefined ) {
    return NotFound;
  }

  const movies: Movie[] | string = await getMovieByTitle(title.toString());

  if (typeof movies === "string") {
    return <h1>{movies}</h1>;
  }

  return movies.map((movie: Movie) => {
    <div>
      <Image src={movie.posterPath} alt={movie.title} />
      <div>
        <h3>{movie.title}</h3>
        <p>{movie.releaseDate.toString()}</p>
      </div>
    </div>
  });
}