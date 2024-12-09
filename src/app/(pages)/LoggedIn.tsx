import { TitledHorizontalMoviePager } from "@/components/generic/movie/MovieListItem"
import { getTrendingMovies } from "@/services/MovieService"
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps"
import React from "react"

interface LoggedInProps {
  onLogout: () => void;
  userDetails?: { username: string; userId: number };
}

export default function LoggedIn({ onLogout, userDetails }: LoggedInProps) {
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
      <TitledHorizontalMoviePager title="Trending Movies" movieItems={trendingMovies} />
    </div>
  )
}
