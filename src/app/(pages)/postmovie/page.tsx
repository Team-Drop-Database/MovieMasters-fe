'use client';

import Movie from "@/models/Movie";
import {ChangeEvent, FormEvent, useState} from "react";
import {postMovie} from "@/services/MovieService";
import {getMovieById} from "@/services/TmdbService";
import SuccessAlert from "@/components/generic/alert/SuccessAlert";
import ErrorAlert from "@/components/generic/alert/ErrorAlert";

export default function PostMovie() {
  const defaultMovie: Movie = {
    id: 0,
    title: '',
    description: '',
    language: '',
    releaseDate: new Date(),
    tmdbRating: 0,
    posterPath: ''
  }
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie>(defaultMovie)

  async function submitMovie(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const result: boolean = await postMovie(movie);

    if (!result) {
      setErrorMessage('Something went wrong while saving the movie');
    } else {
      setMovie(defaultMovie);
      setSuccessMessage('Movie saved');
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setMovie((prevState) => ({ ...prevState, [name]: value }));
  };

  async function getTmdbMovie(formData: FormData): Promise<void> {
    const movieId: FormDataEntryValue | null = formData.get('movieId');
    if (movieId === null) {
      return;
    }
    const tmdbMovie: Movie | string = await getMovieById(+movieId);
    if (typeof tmdbMovie === "object") {
      setMovie(tmdbMovie);
    }
  }

  return (
    <div>
      <div>
        <form action={getTmdbMovie}>
          <div className="flex flex-col mb-5 w-96">
            <label htmlFor="movieId">TMDB movie ID:</label>
            <input type="number"
                   id="movieId"
                   name="movieId"
                   className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
          </div>

          <button type="submit" name="button" value="submit">Get movie</button>
        </form>
      </div>
      <form onSubmit={submitMovie} className="flex flex-col items-center">
        <div className="flex flex-col mb-5 w-96">
          <label htmlFor="title">Title:</label>
          <input type="text"
                 id="title"
                 name="title"
                 onChange={handleChange}
                 value={movie.title}
                 className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
        </div>

        <div className="flex flex-col mb-5 w-96">
          <label htmlFor="description">Description:</label>
          <textarea id="description"
                    rows={4}
                    name="description"
                    onChange={handleChange}
                    value={movie.description}
                    className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
        </div>

        <div className="flex flex-col mb-5 w-96">
          <label htmlFor="language">Language:</label>
          <input type="text"
                 id="language"
                 name="language"
                 onChange={handleChange}
                 value={movie.language}
                 className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
        </div>

        <div className="flex flex-col mb-5 w-96">
          <label htmlFor="posterPath">Poster path:</label>
          <input type="text"
                 id="posterPath"
                 name="posterPath"
                 onChange={handleChange}
                 value={movie.posterPath}
                 className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
        </div>

        <div className="flex flex-col mb-5 w-96">
          <label htmlFor="tmdbRatng">TMDB rating:</label>
          <input type="number"
                 id="tmdbRating"
                 name="tmdbRating"
                 onChange={handleChange}
                 value={movie.tmdbRating}
                 className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
        </div>

        <div className="h-3">
          {errorMessage && <ErrorAlert message={errorMessage} />}
          {successMessage && <SuccessAlert message={successMessage} />}
        </div>

        <button type="submit" name="button" value="submit">Save movie</button>
      </form>
    </div>
  );
}