"use client"
import React from "react";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import { setTimeout } from "timers";
import arrow from "@/assets/images/right-arrow-2.svg";
import Image from "next/image";
import Link from "next/link";

enum ScrollDirection {
  Forward,
  Backward,
}

const LEFT_MARGIN = 64
const MOVIE_ITEM_WIDTH = 250
const MOVIE_ITEM_GAP = 20
const SLIDE_TIME = 500

const PAGER_OFFSET = -250;

export function TitledHorizontalMoviePager({ tmdbmode, movieItems }: { tmdbmode: boolean, movieItems: MovieListItemProps[]}) {
  const [movies, setMovies] = React.useState<MovieListItemProps[]>([])
  const [pagerOffset, setPagerOffset] = React.useState(PAGER_OFFSET)
  const [pagerProperties, setPagerProperties] = React.useState<React.CSSProperties>({
    left: `${pagerOffset + LEFT_MARGIN}px`,
    position: "relative",
    transitionProperty: "left",
    transitionDuration: `${SLIDE_TIME}ms`,
  })
  const [showBackButton, setShowBackButton] = React.useState(false)
  const [showNextButton, setShowNextButton] = React.useState(false)

  React.useEffect(() => {
    const sliderWidth = movieItems.length * (MOVIE_ITEM_WIDTH + MOVIE_ITEM_GAP)
    const containerWidth = window.innerWidth - LEFT_MARGIN
    if (sliderWidth >= containerWidth) {
      setMovies([...movieItems, ...movieItems])
      setShowNextButton(true)
    } else {
      setMovies(movieItems)
    }
  }, [movieItems])

  function scrollMovies(direction: ScrollDirection) {
    const visibleSliderWidth = window.innerWidth - LEFT_MARGIN
    const widthPerItem = MOVIE_ITEM_WIDTH + MOVIE_ITEM_GAP
    const itemsInView = Math.floor(visibleSliderWidth / widthPerItem)
    const completeSliderWidth = movieItems.length * widthPerItem

    let deltaOffset = itemsInView * widthPerItem
    if (direction === ScrollDirection.Forward) {
      deltaOffset *= -1
    }

    let newOffset = pagerOffset + deltaOffset
    const reachedEnd = Math.abs(newOffset) >= completeSliderWidth
    if (reachedEnd) {
      newOffset = completeSliderWidth * -1
    }
    
    newOffset >= PAGER_OFFSET ? setShowBackButton(false) : setShowBackButton(true)

    setPagerOffset(newOffset)
    setPagerProperties({
      left: `${newOffset + LEFT_MARGIN}px`,
      position: "relative",
      transitionProperty: "left",
      transitionDuration: `${SLIDE_TIME}ms`,
    })

    if (reachedEnd) {
      setTimeout(() => {
        setPagerOffset(0)
        setPagerProperties({
          left: `${0 + LEFT_MARGIN}px`,
          position: "relative",
        })
      }, SLIDE_TIME)
      setShowBackButton(false)
    }
  }
  
  return (
    <div className="flex flex-col relative group">
      <div className="flex items-center justify-between px-[4rem] w-full">
      <div className="flex-col justify-end absolute -left-14 top-1/2 origin-center -translate-y-1/2 z-10 opacity-70 hover:opacity-100">
          {showBackButton && (<button className="" onClick={() => scrollMovies(ScrollDirection.Backward)}>
            <Image src={arrow} alt="" className="w-52 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 rotate-180"></Image>
          </button>)}
      </div>
        <div className="flex-col justify-end absolute -right-14 top-1/2 origin-center -translate-y-1/2 z-10 opacity-70 hover:opacity-100">
          {showNextButton && (<button className="" onClick={() => scrollMovies(ScrollDirection.Forward)}>
            <Image src={arrow} alt="" className="w-52 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"></Image>
          </button>)}Heb dit
        </div>
      </div>
      <HorizontalMoviePager tmdbmode={tmdbmode} movieItems={movies} cssProperties={pagerProperties}/>
    </div>
  )
}

type HorizontalMoviePagerProps = {
  tmdbmode: boolean,
  movieItems: MovieListItemProps[],
  cssProperties: React.CSSProperties,
}

function HorizontalMoviePager({tmdbmode, movieItems, cssProperties}: HorizontalMoviePagerProps) {
  return (
    <div className="overflow-x-hidden pt-5 overflow-y-hidden">
      <div style={cssProperties} className="w-fit flex gap-5">
        { [...movieItems, ...movieItems].map((item, index) => (
          <MovieListItem key={index} tmdbmode={tmdbmode} mlip={{
            id: item.id,
            title: item.title,
            posterUrl: item.posterUrl
          }} />
        ))}
      </div>
    </div>
  )
}

function MovieListItem({ mlip, tmdbmode }: {mlip: MovieListItemProps, tmdbmode: boolean}) {
  return (
    <div className=" flex flex-col items-center grow-0 shrink-0 hover:scale-105 transition-transform cursor-pointer">
      <Link href={tmdbmode ? `https://www.themoviedb.org/movie/${mlip.id}` : `/movies/${mlip.id}#top`}>
      <img src={mlip.posterUrl} width={250} className="shadow-2xl" alt={`Poster for ${mlip.title}`}></img>
      <p className="font-inter font-semibold mt-2 w-fill text-center max-w-[250px]">{mlip. title}</p>
      </Link>
    </div>
  )
}
