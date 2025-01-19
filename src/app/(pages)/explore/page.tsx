'use client';

import Loading from "@/components/generic/Loading";
import { TitledHorizontalMoviePager } from "@/components/generic/movie/MovieListItem";
import ElementTransition from "@/components/generic/transitions/ElementTransition";
import Genre from "@/models/Genre";
import MovieList from "@/models/MovieList";
import { getMovieGenres, getMovieListByGenres } from "@/services/MovieService"
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import { useEffect, useState } from "react";

export default function Explore() {

    const [genres, setGenres] = useState<Genre[]>([]);
    const [movieLists, setMovieLists] = useState<MovieList[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    // useEffect(() => {
    //     async function fetchMovies() {
    //         try {

    //             for(let i = 0; i < genres.length; i++) {
    //                 const movies: Movie[] = await getMoviesByGenre([genres[i].name]);
    //                 setMovies(movies);
    //             }
    //             setMovies(movies);
    //         } catch (err: unknown) {
    //         if (err instanceof Error) {
    //             setError(err.message);
    //             } else {
    //             setError("An unknown error occurred.");
    //             }
    //         }
    //     }
    //     fetchMovies();
    // }, [genres]);

    const movieListSections: JSX.Element[] = [];

    // useEffect(() => {
    //     if(genres.length > 0) {
    //         async function fetchByGenre(){
    //             return await getMoviesByGenre([genres[0].name]);
    //         }
    //         fetchByGenre().then(movies => {
    //             console.log(movies);
    //         })
    //     }
    // }, [genres])



    // for(let i = 0; i < genres.length; i++) {
    //     const content = 
    //     <div key={i} className="border border-red-500">
    //         <h3 className="font-inter text-3xl">{genres[i].name}</h3>
    //         <div className="border border-purple-500 h-64">
    //             {}
    //         </div>
    //     </div>;
    //     genreSections.push(content);
    // }

    for(let i = 0; i < movieLists.length; i++) {

        if(movieLists[i].movies.length < 8)
            continue;

        const formattedMovieList: MovieListItemProps[] = movieLists[i]
            .movies.flatMap(movie => {return {id: movie.id, title: movie.title, posterUrl: movie.posterPath}});

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
        return <div>An error occurred.</div>;
    }

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