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
    const result: boolean | string = await postMovie(movie);

    if (typeof result !== 'boolean') {
      setErrorMessage(result);
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
      return ;
    }
    const tmdbMovie: Movie | string = await getMovieById(+movieId);
    if (typeof tmdbMovie === "object") {
      setMovie(tmdbMovie);
    } else {
      setErrorMessage(tmdbMovie);
    }
  }

  function emptyMessage(): void {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  return (
    <div className="flex flex-col">
        <form action={getTmdbMovie} className="flex flex-col items-center w-max self-center mb-10">
          <div className="flex flex-col mb-5 w-96">
            <label htmlFor="movieId">TMDB movie ID:</label>
            <input type="number"
                   id="movieId"
                   name="movieId"
                   className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
               hover:bg-light_grey_active hover:duration-300 hover:cursor-text" required/>
          </div>

          <button type="submit"
                  name="button"
                  value="submit"
                  className="hover:cursor-pointer px-3 py-1 bg-accent_blue rounded
                  hover:bg-accent_blue_active font-[family-name:var(--font-alatsi)] self-start">Get movie</button>
        </form>
      <form onSubmit={submitMovie} className="flex flex-col items-center w-max self-center">
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
        <button type="submit"
                name="button"
                value="submit"
                className="hover:cursor-pointer px-3 py-1 bg-accent_blue rounded
                  hover:bg-accent_blue_active font-[family-name:var(--font-alatsi)] self-start">Save movie</button>
      </form>

      {errorMessage && <ErrorAlert message={errorMessage} onClose={emptyMessage} />}
      {successMessage && <SuccessAlert message={successMessage} onClose={emptyMessage} />}
    </div>
  );
}