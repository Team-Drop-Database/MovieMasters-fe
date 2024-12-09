import { TitledHorizontalMoviePager } from "@/components/generic/movie/MovieListItem"
import { getTrendingMovies } from "@/services/TmdbService";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps"
import React from "react"

interface LoggedInProps {
  userDetails?: { username: string; userId: number };
}

export default function LoggedIn({ userDetails }: LoggedInProps) {
  const [trendingMovies, setTrendingMovies] = React.useState<MovieListItemProps[]>([])

  React.useEffect(() => {
    async function retrieveTrendingMovies() {
      const movieItems = await getTrendingMovies()
      setTrendingMovies(movieItems)
    }

    retrieveTrendingMovies()
  }, [])

  return (
    <div className="flex flex-col py-2">
      <h1 className="mx-[4rem]">Welcome back {userDetails?.username}</h1>
      <TitledHorizontalMoviePager title="Trending Movies" movieItems={trendingMovies} />
    </div>
  )
}
