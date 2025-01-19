"use client"
import React from "react";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import { setTimeout } from "timers";
import arrow from "@/assets/images/right-arrow.svg";
import Image from "next/image";
import BasicTransitionLink from "../transitions/BasicTransitionLink";

type TitledHorizontalMoviePagerProps = {
  title: string
  movieItems: MovieListItemProps[]
}

enum ScrollDirection {
  Forward,
  Backward,
}

const LEFT_MARGIN = 64
const MOVIE_ITEM_WIDTH = 250
const MOVIE_ITEM_GAP = 20
const SLIDE_TIME = 500

const PAGER_OFFSET = -250;

export function TitledHorizontalMoviePager({ title, movieItems }: TitledHorizontalMoviePagerProps) {
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
      <div className="flex-col justify-end absolute left-4 top-1/2 origin-center -translate-y-1/2 z-10">
          <button className="" onClick={() => scrollMovies(ScrollDirection.Backward)}>
            <Image src={arrow} alt="" className="w-14 hover:shadow-2xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 rotate-180"></Image>
          </button>
      </div>
        <div className="flex-col justify-end absolute right-4 top-1/2 origin-center -translate-y-1/2 z-10">
          <button className="" onClick={() => scrollMovies(ScrollDirection.Forward)}>
            <Image src={arrow} alt="" className="w-14 hover:shadow-2xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"></Image>
          </button>
        </div>
      </div>
      <HorizontalMoviePager movieItems={movies} cssProperties={pagerProperties} />
    </div>
  )
}

type HorizontalMoviePagerProps = {
  movieItems: MovieListItemProps[],
  cssProperties: React.CSSProperties,
}

function HorizontalMoviePager({ movieItems, cssProperties }: HorizontalMoviePagerProps) {
  return (
    <div className="overflow-x-hidden pt-5 overflow-y-hidden">
      <div style={cssProperties} className="w-fit flex gap-5">
        { [...movieItems, ...movieItems].map((item, index) => (
          <MovieListItem key={index} id={item.id} title={item.title} posterUrl={item.posterUrl} />
        ))}
      </div>
    </div>
  )
}

function MovieListItem({ id, title, posterUrl }: MovieListItemProps) {
  return (
    <div className=" flex flex-col items-center grow-0 shrink-0 hover:scale-105 transition-transform cursor-pointer">
      <BasicTransitionLink href={`/movies/${id}#top`}>
      <img src={posterUrl} width={250} className="shadow-2xl" alt={`Poster for ${title}`}></img>
      <p className="font-inter font-semibold mt-2 w-fill text-center max-w-[250px]">{title}</p>
      </BasicTransitionLink>
    </div>
  )
}
