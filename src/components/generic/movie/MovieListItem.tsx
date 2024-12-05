import React from "react";
import { MovieListItemProps } from "@/utils/mapper/MovieResponseMaps";
import Image from "next/image";
import { Button } from "@/components/generic/Button";

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

export function TitledHorizontalMoviePager({ title, movieItems }: TitledHorizontalMoviePagerProps) {
  const [pagerOffset, setPagerOffset] = React.useState(0)

  function scrollMovies(direction: ScrollDirection) {
    "use client"

    let sliderWidth = window.innerWidth - LEFT_MARGIN
    let widthPerItem = MOVIE_ITEM_WIDTH + MOVIE_ITEM_GAP
    let itemsInView = Math.floor(sliderWidth / widthPerItem)

    let deltaOffset = itemsInView * widthPerItem
    if (direction === ScrollDirection.Forward) {
      deltaOffset *= -1
    }
    setPagerOffset(pagerOffset + deltaOffset)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-[4rem] w-full">
        <Button text="Back" onClick={() => scrollMovies(ScrollDirection.Backward)} />
        <h1>{title}</h1>
        <Button text="Forward" onClick={() => scrollMovies(ScrollDirection.Forward)} />
      </div>
      <HorizontalMoviePager movieItems={movieItems} offset={pagerOffset} />
    </div>
  )
}

type HorizontalMoviePagerProps = {
  movieItems: MovieListItemProps[],
  offset: number,
}

function HorizontalMoviePager({ movieItems, offset }: HorizontalMoviePagerProps) {
  const offsetClass = `${offset + LEFT_MARGIN}px`
  return (
    <div className="overflow-hidden">
      <div style={{ left: offsetClass }} className="relative w-fit flex gap-5">
        { movieItems.map((item, index) => (
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
