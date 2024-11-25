import Image from "next/image";
import { Movie } from "@/interfaces/movie";

export default async function Movies({params}: {
    params: Promise<{id: number}>
}) {
    const { id } = await params;
    const movieId: number = id;

    if (isNaN(movieId)) {
        return <div>The movie ID must be a number.</div>;
    }

    let response: Response;
    let movie: Movie;
    try {
        response = await fetch(`${process.env.DATABASE_HOST_URL}/api/v1/movies/${movieId}`);

        switch(response.status) {
            case 200: {
                movie = await response.json();
                break;
            }
            case 404: {
                return <div>Movie not found.</div>;
            }
            default: {
                return <div>An error occurred while trying to retrieve the movie.</div>;
            }
        }
    } catch (error) {
        console.log(error);
        return <div>An error occurred while trying to retrieve the movie.</div>;
    }

    return (
        <div className="flex mx-10 my-5 space-x-20">
            <div className="">
                <div className="text-4xl mb-5">{movie.title}</div>
                <Image src={movie.posterPath} alt={movie.title} width="300" height="300"/>
            </div>
            <div className="">
                <div id="movie-ratings" className="flex flex-row space-between justify-between w-1/2 mb-5">
                    <div>
                        <div className="text-2xl">TMDB rating</div>
                        <p>{movie.tmdbRating}</p>
                    </div>
                    <div>
                        <div className="text-2xl">Movie Master rating</div>
                        <p>8.2</p>
                    </div>
                </div>
                <div>
                    <div className="text-2xl">Description</div>
                    <p>{movie.description}</p>
                </div>
                <div>
                </div>
            </div>
        </div>
    );
}