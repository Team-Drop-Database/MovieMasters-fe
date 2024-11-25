import Movie from "@/app/model/movie";

export default async function getMovieById(movieId: number): Promise<Movie> {
    try {
        const response: Response = await fetch(`${process.env.DATABASE_HOST_URL}/api/v1/movies/${movieId}`);
        let movie: Movie;
        switch(response.status) {
            case 200: {
                movie = await response.json();
                return movie;
            }
            case 404: {
                throw new Error("Movie not found.");
            }
            default: {
                throw new Error("An error occurred while trying to retrieve the movie.");
            }
        }
    } catch (error: unknown) {
        console.log(error);
        throw new Error("An error occurred while trying to retrieve the movie.");
    }
}