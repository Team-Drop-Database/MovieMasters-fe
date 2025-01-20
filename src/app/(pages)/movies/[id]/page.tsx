'use client';

import { useEffect, useState } from 'react';
import Movie from "@/models/Movie";
import {useAuthContext} from "@/contexts/AuthContext";
import ElementTransition from '@/components/generic/transitions/ElementTransition';
import Loading from '@/components/generic/Loading';
import {getMovieById} from "@/services/MovieService";
import ReviewSection from '@/components/review/ReviewSection';
import { WatchedState } from '@/services/WatchListService';
import AddToWatchListButton from "@/components/generic/watchlist/AddToWatchListButton";
import {ReviewItemStars} from "@/components/generic/review/StarContainer";

export default function Movies({ params }: { params: Promise<{ id: string }> }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isUserReady, setIsUserReady] = useState<boolean>(false);
  const [watchedState, setWatchedState] = useState<WatchedState>(WatchedState.UNWATCHED)
  const [userHasReview, setUserHasReview] = useState<boolean>();
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

  const movieReleaseYear: string = movie.releaseDate.toString().substring(0, 4);

  return (
    <ElementTransition startYState={50}>
    <div className="grid md:grid-cols-5 mx-10 my-5 gap-0 md:gap-10 font-sans">
      <div className="md:col-span-1 max-w-[300px] justify-self-center mb-5">
        <img
          className="object-cover aspect-2/3"
          src={movie.posterPath}
          alt={movie.title}
        />
      </div>
      <div className="md:col-span-4 flex flex-col">
        <div className="mb-5 border-b border-slate-400 border-opacity-20 pb-4">
          <div className="text-4xl font-medium">{movie.title}</div>
          <h5 className="font-semibold opacity-40 text-sm">
            {movieReleaseYear} - {movie.language.toUpperCase()}
          </h5>
        </div>
        <div
          id="movie-ratings"
          className="flex flex-row space-between justify-between md:w-1/2 mb-5 border-b border-slate-400 border-opacity-20 pb-4"
        >
          <div>
            <div className="text-2xl">TMDB rating</div>
            <p className="text-2xl font-sans font-semibold">{movie.tmdbRating}</p>
          </div>
          {movie.mmAvgRating !== null && (
            <div>
              <div className="text-2xl">Movie Master Rating</div>
              <ReviewItemStars rating={movie.mmAvgRating} />
            </div>
          )}
        </div>
        <div className="border-b border-slate-400 border-opacity-20 pb-4">
          <div className="text-2xl font-semibold">Description</div>
          <p className="font-sans">{movie.description}</p>
        </div>
        {isUserReady && (
          <div className="border-b border-slate-400 border-opacity-20 pb-4">
            <AddToWatchListButton
              params={{
                userId: userDetails?.userId as number,
                movieId: Number(id),
                hasReview: userHasReview,
                onValueChange: setWatchedState,
              }}
            />
          </div>
        )}
        { id !== null &&
          <ReviewSection
            movieId={Number(id)}
            hasWatched={watchedState === WatchedState.WATCHED}
            onReviewCreated={() => {
              setUserHasReview(true);
              if (id) {fetchMovie(id);}
            }}
            onReviewDeleted={() => {
              setUserHasReview(false);
              if (id) {fetchMovie(id);}
            }}
            className="mt-4"
          />
        }
      </div>
    </div>
    </ElementTransition>
  );
}
