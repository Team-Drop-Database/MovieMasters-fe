'use client';

import Loading from "@/components/generic/Loading";
import { TitledHorizontalMoviePager } from "@/components/generic/movie/MovieListItem";
import ElementTransition from "@/components/generic/transitions/ElementTransition";
import Genre from "@/models/Genre";
import MovieList from "@/models/MovieList";
import { getMovieGenres, getMovieListByGenres } from "@/services/MovieService"
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import { useEffect, useState } from "react";

/**
 * The 'explore' page, where users can browse 
 * movies from different genres.
 */
export default function Explore() {

    const [genres, setGenres] = useState<Genre[]>([]);
    const [movieLists, setMovieLists] = useState<MovieList[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load the genres first
    useEffect(() => {
        async function fetchGenres() {
            try {
                const genres: Genre[] = await getMovieGenres();
                setGenres(genres);
            } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                } else {
                setError("An unknown error occurred.");
                }
            }
        }
        fetchGenres();
    }, []);

    // Then, using the genres, fetch lists of movies based on those genres
    useEffect(() => {
        async function fetchMovieLists() {
            try {
                // Extract the names
                const genreNames: string[] = genres.flatMap(genre => genre.name);
                const movieLists: MovieList[] = await getMovieListByGenres(genreNames);
                setMovieLists(movieLists);
            } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                } else {
                setError("An unknown error occurred.");
                }
            }
        }
        fetchMovieLists();
    }, [genres])

    // List of JSX elements, whereby each element is a 'section' containing 
    // the name of the genre and a list of movies. This will be 
    // rendered ultimately.
    const movieListSections: JSX.Element[] = [];

    // Circle through the movielists to construct 
    // the 'movieListSections' JSX elements
    for(let i = 0; i < movieLists.length; i++) {

        // To avoid a strange visual bug, we don't show a
        //  category if it has less than 8 movies in it.
        if(movieLists[i].movies.length < 8)
            continue;

        // Format the movies to a format that TitledHorizontalMoviePager can understand
        const formattedMovieList: MovieListItemProps[] = movieLists[i]
            .movies.flatMap(movie => {return {id: movie.id, title: movie.title, posterUrl: movie.posterPath}});

        // Actually create the JSX content
        const content = 
        <div key={i} className="mb-12">
            <h3 className="font-inter text-3xl ml-4">{movieLists[i].genre}</h3>
            <div className="">
                <TitledHorizontalMoviePager movieItems={formattedMovieList}></TitledHorizontalMoviePager>
            </div>
        </div>;
        movieListSections.push(content);
    }

    if(error) {
        return <div>An unexpected error occurred.</div>;
    }

    // Show Loading indicator when the page hasn't loaded
    if(movieListSections.length == 0){
        return <Loading/>
    }

    return <ElementTransition startYState={-50}>
    <div className="">
        <h1 className="font-inter font-lg text-5xl mb-1 ml-4">Explore</h1>
        <h2 className="font-inter font-light text-2xl mb-8 ml-4 text-gray-400">From today&#39;s biggest hits to the classics you love.</h2>
        {movieListSections}
   </div>;
</ElementTransition>

}