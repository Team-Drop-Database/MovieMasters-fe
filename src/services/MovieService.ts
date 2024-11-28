import Movie from "@/models/Movie"

export default async function getMovieById(movieId: number): Promise<Movie | null> {
  try {
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/movies/${movieId}`);

    let movie: Movie;
    switch(response.status) {
      case 200: {
        movie = await response.json();
        return movie;
      }
      case 404: {
        console.warn("Could not find movie with ID: " + movieId);
        return null;
      }
      default: {
        console.warn("Something went wrong while trying to get the movie with ID: " + movieId);
        return null;
      }
    }
  } catch (error: unknown) {
    console.error("An error occurred while trying to retrieve the movie.");
    return null;
  }
}