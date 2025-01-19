import React from "react"
import BigTextField from "@/components/generic/BigTextField"
import { getFillAmount, Star } from "@/components/generic/review/Star"
import { Button } from "@/components/generic/Button"
import { postReview } from "@/services/ReviewService"
import { ReviewResponse } from "@/models/Review"

type PostReviewContainerProps = {
  movieId: number,
  userId: number,
  onReviewPosted: (review: ReviewResponse) => void,
}

export default function PostReviewContainer({ movieId, userId, onReviewPosted }: PostReviewContainerProps) {
  const [rating, setRating] = React.useState(0)
  const [reviewBody, setReviewBody] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function submitReview() {
    try {
      const createdReview = await postReview(userId, movieId, rating, reviewBody)
      onReviewPosted(createdReview)
      setReviewBody("");
    } catch(error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <StarContainer rating={rating} confirmRating={setRating} />
      <BigTextField value={reviewBody} onValueChange={setReviewBody} placeholder="Type your review here.." className="h-[10rem] w-full" />
      { errorMessage !== null && <div className="text-red-700">{errorMessage}</div> }
      <Button text="Submit" onClick={submitReview} />
    </div>
  )
}

type StarContainerProps = {
  rating: number,
  confirmRating: (newValue: number) => void,
}

function StarContainer({ rating, confirmRating }: StarContainerProps) {
  const [shownRating, setShownRating] = React.useState(rating)

  return (
    <div onMouseLeave={() => setShownRating(rating)} className="flex w-fit">
      <Star
        setHalfHoverAmount={() => setShownRating(1)} setFullHoverAmount={() => setShownRating(2)}
        confirmHalfStarAmount={() => confirmRating(1)} confirmFullStarAmount={() => confirmRating(2)}
        fillAmount={getFillAmount(shownRating, 1)}
        className="px-1"
      />
      <Star
        setHalfHoverAmount={() => setShownRating(3)} setFullHoverAmount={() => setShownRating(4)}
        confirmHalfStarAmount={() => confirmRating(3)} confirmFullStarAmount={() => confirmRating(4)}
        fillAmount={getFillAmount(shownRating, 2)}
        className="px-1"
      />
      <Star
        setHalfHoverAmount={() => setShownRating(5)} setFullHoverAmount={() => setShownRating(6)}
        confirmHalfStarAmount={() => confirmRating(5)} confirmFullStarAmount={() => confirmRating(6)}
        fillAmount={getFillAmount(shownRating, 3)}
        className="px-1"
      />
      <Star
        setHalfHoverAmount={() => setShownRating(7)} setFullHoverAmount={() => setShownRating(8)}
        confirmHalfStarAmount={() => confirmRating(7)} confirmFullStarAmount={() => confirmRating(8)}
        fillAmount={getFillAmount(shownRating, 4)}
        className="px-1"
      />
      <Star
        setHalfHoverAmount={() => setShownRating(9)} setFullHoverAmount={() => setShownRating(10)}
        confirmHalfStarAmount={() => confirmRating(9)} confirmFullStarAmount={() => confirmRating(10)}
        fillAmount={getFillAmount(shownRating, 5)}
        className="px-1"
      />
    </div>
  )
}
