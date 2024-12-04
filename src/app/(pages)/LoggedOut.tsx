import React from "react"
import Image from "next/image"
import { Button } from "@/components/generic/Button"
import { navigateToSignup, navigateToLogin } from "@/utils/navigation/HomeNavigation"
import { Star } from "@/components/generic/review/Star"
import { requestReviewsByAmount } from "@/services/ReviewService"
import { mapReviewResponsesToItems, ReviewItemProps } from "@/utils/mapper/ReviewResponseMaps"
import neutral from "@/assets/images/no-profile-pic.jpg"

export default function LoggedOut() {
  return (
    <>
      <div className="mx-[4rem] mt-[4rem] flex flex-col">
        <h1>Welcome to Movie Master</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id sem varius ligula imperdiet euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec posuere pharetra neque, aliquam pretium sem vestibulum eget. Nunc vel nibh vel lorem aliquam varius</p>
      </div>
      <div className="mx-[4rem] flex gap-5">
        <Button text="Sign up" onClick={navigateToSignup} />
        <Button text="Log in" onClick={navigateToLogin} />
      </div>
      <ReviewList />
    </>
  )
}

function ReviewList() {
  const reviewAmount = 10
  const [reviewList, setReviewList] = React.useState<ReviewItemProps[]>([])
  const sliderRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    async function loadReviews() {
      const reviewResponse = await requestReviewsByAmount(reviewAmount)
      const mappedResponse = mapReviewResponsesToItems(reviewResponse)

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
            starAmount={review.starAmount}
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
    <div className="h-72 w-72 p-2 shrink-0 flex flex-col rounded-xl shadow-lg border-background_secondary border-4 gap-5">
      <div className="flex items-start gap-2">
        <Image
          src={props.profilePicture || neutral}
          width={45}
          height={45}
          alt="Profile picture"
          className="rounded-full"
        />
        <p className="details grow">{props.reviewerName}</p>
      </div>
      <ReviewItemStars starAmount={props.starAmount} />
      <p className="details">On: {props.movieName}</p>
      <p className="details">{props.reviewBody}</p>
    </div>
  )
}

type ReviewItemStarsProps = {
  starAmount: number
}

function ReviewItemStars({ starAmount }: ReviewItemStarsProps) {
  return (
    <div className="flex gap-2">
      <Star isYellow={starAmount >= 1} />
      <Star isYellow={starAmount >= 2} />
      <Star isYellow={starAmount >= 3} />
      <Star isYellow={starAmount >= 4} />
      <Star isYellow={starAmount >= 5} />
    </div>
  )
}
