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
          <h1 className="mx-[4rem] font-inter font-semibold  underline-offset-[12px] decoration-slate-600 decoration-1 text-center sm:text-left text-2xl sm:text-4xl">Welcome, <span className="font-inter text-blue-500">{userDetails?.username}</span>!</h1>
          <h1 className="font-inter font-semibold mb-3 sm:text-4xl text-center">See what&#39;s <span className="text-yellow-500">trending</span>.</h1>
          <TitledHorizontalMoviePager movieItems={trendingMovies} />
      </ElementTransition>
    </div>
  )
}
