'use client';

import {useEffect, useState} from 'react';
import Movie from "@/models/Movie";
import getMovieById from "@/services/MovieService";
import WatchListButtonWrapper from "@/components/generic/watchlist/WatchListButtonWrapper";

export default function Movies({params}: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null); // Store the id in state

  const TEMP_USER_ID = 1;

  // Function to fetch the movie data
  async function fetchMovie(movieId: string) {
    try {
      const data = await getMovieById(Number(movieId)); // Convert `id` to number for API request
      setMovie(data as Movie);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }

  // Wait for params to resolve and extract the id
  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;  // Wait for params to resolve
      setId(resolvedParams.id); // Set the id in state
    }

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchMovie(id); // Call fetchMovie when id is available
    }
  }, [id]); // Trigger fetchMovie when `id` changes

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  if (typeof movie === "string") {
    return <div>{movie}</div>; 
  }

  const movieReleaseYear: string = movie.releaseDate.toString().substring(0, 4);

  return (
    <div className="flex mx-10 my-5 space-x-20 font-sans">
      <div className="max-w-[300px]">
        <img
          className="object-cover aspect-2/3"
          src={movie.posterPath}
          alt={movie.title}
        />
      </div>
      <div className="">
        <div className="mb-5 border-b border-slate-400 border-opacity-20 pb-4">
          <div className="text-4xl font-medium">{movie.title}</div>
          <h5 className="font-semibold opacity-40 text-sm">
            {movieReleaseYear} - {movie.language.toUpperCase()}
          </h5>
        </div>
        <div
          id="movie-ratings"
          className="flex flex-row space-between justify-between w-1/2 mb-5 border-b border-slate-400 border-opacity-20 pb-4"
        >
          <div>
            <div className="text-2xl">TMDB rating</div>
            <p className="text-2xl font-sans font-semibold">{movie.tmdbRating}</p>
          </div>
          <div>
            <div className="text-2xl">Movie Master rating</div>
            <p className="text-2xl font-sans font-semibold">8.2</p>
          </div>
        </div>
        <div className="border-b border-slate-400 border-opacity-20 pb-4">
          <div className="text-2xl font-semibold">Description</div>
          <p className="font-sans">{movie.description}</p>
        </div>
        <WatchListButtonWrapper
          params={{
            userId: TEMP_USER_ID,
            movieId: Number(id), // Ensure `id` is treated as a number
          }}
        />
      </div>
    </div>
  );
}
