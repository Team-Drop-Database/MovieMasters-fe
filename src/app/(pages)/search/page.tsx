'use client';
import Movie from "@/models/Movie";
import {getMovieByTitle, getNumberOfPages} from "@/services/MovieService";
import {useEffect, useRef, useState} from "react";
import DisplayMovies from "@/components/generic/search/DisplayMovies";
import {useSearchParams} from "next/navigation";
import {Suspense} from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const title: string | null = searchParams.get("title");
  const prevValues = useRef({title: title, pageNumber: pageNumber});

  // Fetching new movies when the title or page number changes
  useEffect(() => {
    if (prevValues.current.title !== title) {
      setPageNumber(1);
    }

    async function setTotalPages() {
      try {
        setNumberOfPages(await getNumberOfPages(title));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    async function fetchMovies() {
      try {
        setMovies(await getMovieByTitle(title, pageNumber - 1));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    setTotalPages().then();
    fetchMovies().then();

    prevValues.current = {title, pageNumber};
  }, [title, pageNumber]);

  if (error) {
    return <p>Failed to fetch data. Error: {error}</p>;
  }

  /**
   * Page number buttons for navigation
   *
   * @param number Number to display in the button
   */
  function PageNumberButton({number}: { number: number }) {
    return (
      <button className="hover:backdrop-brightness-50 px-3 py-1 rounded-lg"
              onClick={() => setPageNumber(number)}>
        {number}
      </button>
    );
  }

  /**
   * Method to determine the amount and type of buttons to display in the navigation
   */
  function PaginationButtons() {
    // Only showing one element if there is one page
    if (numberOfPages === 1) {
      return (
        <div className="backdrop-brightness-50 px-3 py-1 rounded-lg">
          {pageNumber}
        </div>
      );
    }

    // Determine the start number of the first button
    let startNumber: number = 1;
    if (pageNumber > 1) {
      // page number - 1 if there is more than one page
      startNumber = pageNumber - 1;
    }
    if (pageNumber === numberOfPages) {
      // For when the user is at last page, if the outcome is smaller than 1, set it to 1
      startNumber = numberOfPages - 2 < 1 ? 1 : numberOfPages - 2;
    }
    startNumber = startNumber <= 1 ? 1 : startNumber;
    const buttonItems = [];

    // 3 iterations if there are more than 2 pages
    const iterations: number = numberOfPages <= 3 ? numberOfPages : 3;
    for (let i = startNumber; i < iterations + startNumber; i++) {
      // Displaying the
      if (i === pageNumber) {
        buttonItems.push(<div key={i} className="backdrop-brightness-50 px-3 py-1 rounded-lg">{i}</div>);
      } else {
        buttonItems.push(<PageNumberButton key={i} number={i}/>);
      }
    }

    // Displaying the amount of pages if the user is not at the final page
    if (numberOfPages - pageNumber > 1) {
      buttonItems.push(<div key="dots" className="px-3 py-1">...</div>);
      buttonItems.push(<PageNumberButton key="last-page" number={numberOfPages}/>);
    }
    return buttonItems;
  }

  if (movies.length > 0) {
    return (
      <div className="mx-5">
        <h1 className="mb-5">Results for movies with title: '{title}'</h1>
        <DisplayMovies movies={movies}/>
        <div className="flex justify-center space-x-2 text-xl mt-5">
          <button disabled={pageNumber <= 1}
                  className="px-3 py-1 rounded-lg
                  hover:cursor-pointer disabled:cursor-not-allowed
                  enabled:hover:backdrop-brightness-50
                  disabled:brightness-50"
                  onClick={() => setPageNumber(pageNumber - 1)}>
                  ← Previous
          </button>
          <PaginationButtons/>
          <button disabled={pageNumber === numberOfPages}
                  className="px-3 py-1 rounded-lg hover:cursor-pointer disabled:cursor-not-allowed
                  enabled:hover:backdrop-brightness-50
                  disabled:brightness-50"
                  onClick={() => setPageNumber(pageNumber + 1)}>
                  Next →
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1>No movies are found.</h1>
        <div>No movies found with title: '{title}'</div>
      </div>
    );
  }
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
