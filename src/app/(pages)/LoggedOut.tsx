import React from "react"
import Image from "next/image"
import { requestReviewsByAmount } from "@/services/ReviewService"
import { mapReviewResponsesToItems, ReviewItemProps } from "@/utils/mapper/ReviewResponseMaps"
import neutral from "@/assets/images/no-profile-pic.jpg"
import ElementTransition from "@/components/generic/transitions/ElementTransition"
import { ReviewItemStars } from "@/components/generic/review/StarContainer"
import Link from "next/link"

export default function LoggedOut() {
  return (
    <>
    {/* Title */}
      <section className="flex w-full justify-evenly p-24 pt-20 min-h-screen">
        <ElementTransition startYState={-50}>
          <div className="flex flex-col gap-3 max-w-[550px] items-center">
            <h1 className="text-white text-5xl font-inter font-bold text-center">Movies made <span className="text-blue-500">social</span>.</h1>
            <p className="font-inter text-white text-2xl opacity-70 text-center mb-5">Explore the latest blockbusters, share reviews, and connect with fellow film lovers.</p>
            <Link href="/explore">
              <button className="opacity-60 hover:opacity-100 px-4 py-2 rounded-2xl bg-indigo-500 hover:ring-1 hover:scale-105 shadow-md font-inter text-2xl font-semibold transition-all">Start Browsing</button>
            </Link>
            <a className="hover:scale-110 transition-all origin-bottom" href="#review-section">
            <Image className="mt-48 animate-bounce cursor-pointer transition-all opacity-40 hover:opacity-100" src={"/double_arrow.svg"} alt={"double_arrow.svg"} width={60} height={60}></Image>
            </a>
          </div>
        </ElementTransition>
      </section>
      {/* Review section */}
      <section id="review-section" className="flex flex-col items-center gap-1 overflow-hidden scroll-mt-28 mb-40">
        <h2 className="font-inter text-4xl text-center font-bold"><span className="text-amber-500">Unleash</span> your inner critic.</h2>
        <p className="font-inter text-white text-2xl opacity-40 text-center mb-12 max-w-[600px]">Share your movie reviews, discover new perspectives, and join the conversation.</p>
       <ReviewList/>
      </section>
    </>
  )
}

function ReviewList() {
  const reviewAmount = 10
  const [reviewList, setReviewList] = React.useState<ReviewItemProps[]>([])
  const sliderRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    async function loadReviews() {
      const reviewResponse = await requestReviewsByAmount(reviewAmount)
      const mappedResponse = mapReviewResponsesToItems(reviewResponse)

      if (mappedResponse.length === 0) return
      const multiplier = reviewAmount / mappedResponse.length
      const multiplied: ReviewItemProps[] = []
      for (let i = 0; i < multiplier; i++) {
        multiplied.push(...mappedResponse)
      }
      setReviewList(multiplied)
    }

    loadReviews()
  }, [])

  return (
    <div className="h-72 overflow-hidden mb-[4rem]">
      <div ref={sliderRef} className={`animate-slide w-fit flex gap-16`}>
        { [...reviewList, ...reviewList].map((review, index) => {
          return <ReviewItem
            reviewerName={review.reviewerName}
            profilePicture={review.profilePicture}
            movieName={review.movieName}
            rating={review.rating}
            reviewBody={review.reviewBody}
            key={index}
          />
        })}
      </div>
    </div>
  )
}

function ReviewItem(props: ReviewItemProps) {
  return (
    <div className="h-72 w-72 py-6 px-4 shrink-0 flex flex-col rounded-xl border border-slate-500 border-opacity-10 gap-5 shadow-2xl">
      <p className="font-inter font-semibold border-b border-b-slate-500 border-opacity-20 text-xl pb-2">
        {props.movieName}
      </p>

      <div className="flex items-start gap-2">
        <div className="relative w-[45px] h-[45px]">
          <Image
            src={props.profilePicture || neutral}
            alt="Profile picture"
            fill
            sizes="45"
            className="rounded-full object-cover"
          />
        </div>
        <p className="grow">{props.reviewerName}</p>
      </div>
      <ReviewItemStars rating={props.rating} />
      <p className="font-inter font-medium">{props.reviewBody}</p>
    </div>
  );
}
