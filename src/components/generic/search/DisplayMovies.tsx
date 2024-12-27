import Movie from "@/models/Movie";
import {redirect} from "next/navigation";

export default function DisplayMovies({ movies} : { movies: Movie[]}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {movies.map(movie => (
        <div key={movie.id} className="flex flex-row gap-4 cursor-pointer"
             onClick={() => redirect(`/movies/${movie.id}`)}>
          <img
            className="max-w-20"
            src={movie.posterPath}
            alt={movie.title}
          />
          <div>
            <h1>{movie.title}</h1>
            <div>{new Date(movie.releaseDate).getFullYear()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
