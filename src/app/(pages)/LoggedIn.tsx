import { TitledHorizontalMoviePager } from "@/components/generic/movie/MovieListItem"
import ElementTransition from "@/components/generic/transitions/ElementTransition";
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
      <ElementTransition startYState={50}>
          <h1 className="mx-[4rem] font-inter font-semibold  underline-offset-[12px] decoration-slate-600 decoration-1">Welcome back, <span className="font-inter text-blue-500">{userDetails?.username}</span>.</h1>
          <TitledHorizontalMoviePager title="See what's" movieItems={trendingMovies} />
      </ElementTransition>
    </div>
  )
}
