"use client"
import React from "react";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import Image from "next/image";
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
  const [pagerOffset, setPagerOffset] = React.useState(0)
  const [pagerProperties, setPagerProperties] = React.useState<React.CSSProperties>({
    left: `${pagerOffset + LEFT_MARGIN}px`,
    position: "relative",
    transitionProperty: "left",
    transitionDuration: `${SLIDE_TIME}ms`,
  })
  const [showBackButton, setShowBackButton] = React.useState(false)
  const [showNextButton, setShowNextButton] = React.useState(false)

  React.useEffect(() => {
    let sliderWidth = movieItems.length * (MOVIE_ITEM_WIDTH + MOVIE_ITEM_GAP)
    let containerWidth = window.innerWidth - LEFT_MARGIN
    if (sliderWidth >= containerWidth) {
      setMovies([...movieItems, ...movieItems])
      setShowNextButton(true)
    } else {
      setMovies(movieItems)
    }
  }, [movieItems])

  function scrollMovies(direction: ScrollDirection) {
    let visibleSliderWidth = window.innerWidth - LEFT_MARGIN
    let widthPerItem = MOVIE_ITEM_WIDTH + MOVIE_ITEM_GAP
    let itemsInView = Math.floor(visibleSliderWidth / widthPerItem)
    let completeSliderWidth = movieItems.length * widthPerItem

    let deltaOffset = itemsInView * widthPerItem
    if (direction === ScrollDirection.Forward) {
      deltaOffset *= -1
    }

    let newOffset = pagerOffset + deltaOffset
    let reachedEnd = Math.abs(newOffset) >= completeSliderWidth
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-[4rem] w-full">
        <Button
          text="Previous" 
          onClick={() => scrollMovies(ScrollDirection.Backward)}
          className={showBackButton ? "" : "opacity-0"}
          enabled={showBackButton}
        />
        <h1>{title}</h1>
        <Button 
          text="Next" 
          onClick={() => scrollMovies(ScrollDirection.Forward)} 
          className={showNextButton ? "" : "opacity-0"}
          enabled={showNextButton}
        />
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
    <div className="overflow-hidden">
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
    <div className="w-min flex flex-col items-center grow-0 shrink-0">
      <div className="relative w-[250px] h-[250px]">
        <Image
          src={posterUrl}
          alt={`Poster for ${title}`}
          fill
          priority
          sizes="(width: 250px), (height: 250px)"
          className="shadow-2xl rounded-2xl object-cover"
        />
      </div>
      <p className="w-fill text-center">{title}</p>
    </div>
  )
}