'use client';

import { useEffect, useState } from 'react';
import Movie from "@/models/Movie";
import getMovieById from "@/services/MovieService";
import WatchListButtonWrapper from "@/components/generic/watchlist/WatchListButtonWrapper";
import {useAuthContext} from "@/contexts/AuthContext";
import ElementTransition from '@/components/generic/transitions/ElementTransition';
import Loading from '@/components/generic/Loading';
import ReviewSection from '@/components/review/ReviewSection';
import { WatchedState } from '@/services/WatchListService';

export default function Movies({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isUserReady, setIsUserReady] = useState<boolean>(false);
  const [watchedState, setWatchedState] = useState<WatchedState>(WatchedState.UNWATCHED)
  const { userDetails } = useAuthContext();

  const fetchMovie = (movieId: string) => {
    getMovieById(Number(movieId))
      .then((data) => {
        setMovie(data as Movie);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      });
  };

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchMovie(id);
    }
  }, [id]);

  useEffect(() => {
    if (userDetails?.userId) {
      setIsUserReady(true); // Set as ready when userDetails are available
    }
  }, [userDetails]);


  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <Loading/>
  }

  if (typeof movie === "string") {
    return <div>{movie}</div>;
  }

  const movieReleaseYear: string = movie.releaseDate.toString().substring(0, 4);

  return (
    <ElementTransition>
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
        {isUserReady && (
          <div className="border-b border-slate-400 border-opacity-20 pb-4">
            <WatchListButtonWrapper
              params={{
                userId: userDetails?.userId as number,
                movieId: Number(id),
                onValueChange: setWatchedState,
              }}
            />
          </div>
        )}
        { id !== null &&
          <ReviewSection
            movieId={Number(id)}
            hasWatched={watchedState === WatchedState.WATCHED}
            onReviewCreated={review => console.info(review)}
            className="mt-4"
          />
        }
      </div>
    </div>
    </ElementTransition>
  );
}
