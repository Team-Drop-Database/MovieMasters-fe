"use client"
import React from "react";
import { Button } from "@/components/generic/Button";
import { navigateToLogin, navigateToSignup } from "@/utils/navigation/HomeNavigation";
import gibby from "@/assets/images/studio_gibby.jpeg"
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col gap-14 font-[family-name:var(--font-alatsi)]">
      <div className="mx-[4rem] mt-[4rem] flex flex-col">
        <h1>Welcome to Movie Master</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id sem varius ligula imperdiet euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec posuere pharetra neque, aliquam pretium sem vestibulum eget. Nunc vel nibh vel lorem aliquam varius</p>
      </div>
      <div className="mx-[4rem] flex gap-5">
        <Button text="Sign up" onClick={navigateToSignup} />
        <Button text="Log in" onClick={navigateToLogin} />
      </div>
      <ReviewList />
    </main>
  );
}

function ReviewList() {
  const reviews: ReviewItemProps[] = [
    { reviewerName: "Reviewer McReviewface", movieName: "Joker 2", starAmount: 1, reviewBody: "This movie sucked big doodoo." },
    { reviewerName: "Actual Reviewer", movieName: "Madame Web", starAmount: 5, reviewBody: "It\'s webbin\' time. ABSOLUTE CINEMA" },
    { reviewerName: "Actual Reviewer", movieName: "Morbius", starAmount: 5, reviewBody: "It\'s morbin\' time. ABSOLUTE CINEMA" },
  ]
  const [reviewList, setReviewList] = React.useState<ReviewItemProps[]>([])
  const sliderRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (sliderRef.current == null) return
    const minimumReviewAmount = 10
    const multiplier = Math.round(minimumReviewAmount / reviews.length) * 2
    let newReviews: ReviewItemProps[] = []
    for (let i = 1; i <= multiplier; i++) {
      newReviews.push(...reviews)
    }
    setReviewList(newReviews)
  }, [sliderRef.current])

  return (
    <div className="h-60 overflow-hidden mb-[4rem]">
      <div ref={sliderRef} className={`animate-slide w-fit flex gap-16`}>
        { reviewList.map((review, index) => {
          return <ReviewItem 
            reviewerName={review.reviewerName}
            movieName={review.movieName}
            starAmount={review.starAmount}
            reviewBody={review.reviewBody}
            key={index}
          />
        })}
      </div>
    </div>
  )
}

type ReviewItemProps = {
  reviewerName: string,
  movieName: string,
  starAmount: number,
  reviewBody: string,
}

function ReviewItem(props: ReviewItemProps) {
  return (
    <div className="slide w-60 p-2 shrink-0 flex flex-col rounded-xl shadow-lg border-background_secondary border-4 gap-5">
      <div className="flex items-start gap-2">
        <Image
          src={gibby}
          width={45}
          height={45}
          alt="Profile picture"
          className="rounded-full"
        />
        <p className="details grow">{props.reviewerName}</p>
      </div>
      <p className="details">On: {props.movieName}</p>
      <p className="details">{props.reviewBody}</p>
    </div>
  )
}
