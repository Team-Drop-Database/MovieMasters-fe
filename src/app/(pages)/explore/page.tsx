'use client';

import Genre from "@/models/Genre";
import Movie from "@/models/Movie";
import { getMovieGenres, getMoviesByGenre } from "@/services/MovieService"
import { useEffect, useState } from "react";

export default function Explore() {

    const [genres, setGenres] = useState<Genre[]>([]);
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
    })

    const genreSections: JSX.Element[] = [];

    for(let i = 0; i < genres.length; i++) {
        const content = 
        <div key={i}>
            <h3>{genres[i].name}</h3>
        </div>;
        genreSections.push(content);
    }

    if(error) {
        return <div>An error occurred.</div>;
    }

    return <div>
                {genreSections}
           </div>;
}