'use client';
import Movie from "@/models/Movie";
import {getMovieByTitle} from "@/services/MovieService";
import {useEffect, useState} from "react";
import {redirect, useSearchParams} from 'next/navigation'


export default function Search() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const title: string | null = searchParams.get("title");

  useEffect(() => {
    async function fetchMovies(){
      try {
        if (!title) {
          return;
        }
        const data = await getMovieByTitle(title);
        setMovies(data)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }
    fetchMovies();
  }, [title]);

  if (error) {
    return <p>Failed to fetch data. Error: {error}</p>;
  }

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
  );
}