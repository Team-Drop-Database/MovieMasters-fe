import Movie from "@/models/Movie"

export default async function getMovieById(movieId: number): Promise<Movie | string> {
  try {
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/movies/${movieId}`);

    let movie: Movie;
    let message: string;
    switch(response.status) {
      case 200: {
        movie = await response.json();
        return movie;
      }
      case 404: {
        message = "Could not find movie with ID: " + movieId;
        console.warn(message);
        return message;
      }
      default: {
        message = "Something went wrong while trying to get the movie with ID: " + movieId;
        console.warn(message);
        return message;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    return "Something went wrong while trying to get the movie with ID: " + movieId;
  }
}