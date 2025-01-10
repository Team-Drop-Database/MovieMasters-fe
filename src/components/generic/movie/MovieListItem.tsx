"use client"
import React from "react";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import { Button } from "@/components/generic/Button";
import { setTimeout } from "timers";

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

export function TitledHorizontalMoviePager({ title, movieItems }: TitledHorizontalMoviePagerProps) {
  const [movies, setMovies] = React.useState<MovieListItemProps[]>([])
  const [pagerOffset, setPagerOffset] = React.useState(-250)
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

    newOffset === 0 ? setShowBackButton(false) : setShowBackButton(true)

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
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-[4rem] w-full">
      <div className="flex-col justify-end">
        <Button
            text="Previous" 
            onClick={() => scrollMovies(ScrollDirection.Backward)}
            className={showBackButton ? "" : "opacity-0"}
            enabled={showBackButton}
          />
      </div>
        <h1 className="font-inter font-semibold mb-3 sm:text-4xl">{title}<span className="text-yellow-500"> trending</span>.</h1>
        <div className="flex-col justify-end">
          <Button 
            text="Next" 
            onClick={() => scrollMovies(ScrollDirection.Forward)} 
            className={showNextButton ? "" : "opacity-0"}
            enabled={showNextButton}
          />
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
    <div className="overflow-x-hidden pt-5">
      <div style={cssProperties} className="w-fit flex gap-5">
        { [...movieItems, ...movieItems].map((item, index) => (
          <MovieListItem key={index} title={item.title} posterUrl={item.posterUrl} />
        ))}
      </div>
    </div>
  )
}

function MovieListItem({ title, posterUrl }: MovieListItemProps) {
  return (
    <div className=" flex flex-col items-center grow-0 shrink-0 hover:scale-105 transition-transform cursor-pointer">
      <img src={posterUrl} width={250} className="shadow-2xl" alt={`Poster for ${title}`}></img>
      <p className="font-inter font-semibold mt-2 w-fill text-center max-w-[250px]">{title}</p>
    </div>
  )
}
