import { useAuthContext } from "@/contexts/AuthContext"
import PostReviewContainer from "./PostReviewContainer"
import { ReviewResponse } from "@/models/Review"
import React from "react"
import { getReviewsByMovie } from "@/services/ReviewService"
import Image from "next/image"
import { ReviewItemStars } from "@/components/generic/review/StarContainer"
import Anonymous from "@/assets/images/no-profile-pic.jpg"

type ReviewSectionProps = {
  movieId: number,
  hasWatched: boolean,
  onReviewCreated: (review: ReviewResponse) => void,
  className?: string,
}

export default function ReviewSection({ movieId, hasWatched, onReviewCreated, className = "" }: ReviewSectionProps) {
  const { isLoggedIn, userDetails } = useAuthContext()
  const [reviews, setReviews] = React.useState<ReviewResponse[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const retrieveReviews = async () => {
    try {
      const foundReviews = await getReviewsByMovie(movieId);
      setReviews(foundReviews);
      setErrorMessage(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  React.useEffect(() => {
    retrieveReviews();
  }, []);

  return (
    <div className={`${className} flex flex-col gap-2`}>
      { isLoggedIn && userDetails?.userId !== undefined && hasWatched &&
        <PostReviewContainer movieId={movieId} userId={userDetails?.userId} onReviewPosted={(newReview) => {
          onReviewCreated(newReview);
          retrieveReviews();
        }} />
      }
      { errorMessage && <div className="text-red-800">{errorMessage}</div> }
      <ReviewList reviews={reviews} />
    </div>
  )
}

type ReviewListProps = {
  reviews: ReviewResponse[],
}

function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="flex flex-col gap-3">
      { reviews.map((review, index) => <ReviewListItem review={review} key={index} />) }
    </div>
  )
}

type ReviewListItemProps = {
  review: ReviewResponse,
}

function ReviewListItem({ review }: ReviewListItemProps) {
  return (
    <div className="p-2 shrink-0 flex flex-col rounded-xl shadow-lg border border-background_secondary gap-2">
      <div className="flex items-start gap-2">
        <div className="relative w-12 h-12">  {/* 45px x 45px size */}
          <Image
            src={review.userProfilePicture || Anonymous}
            alt="Profile picture"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <p className="details grow">{review.username}</p>
      </div>
      <ReviewItemStars rating={review.rating} />
      <p className="details">{review.reviewBody}</p>
    </div>
  )
}
