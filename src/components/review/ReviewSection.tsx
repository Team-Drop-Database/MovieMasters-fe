import { useAuthContext } from "@/contexts/AuthContext"
import PostReviewContainer from "./PostReviewContainer"
import { ReviewResponse } from "@/models/Review"
import React from "react"
import {deleteReview, getReviewsByMovie} from "@/services/ReviewService"
import Image from "next/image"
import { ReviewItemStars } from "@/components/generic/review/StarContainer"
import Anonymous from "@/assets/images/no-profile-pic.jpg"
import ConfirmDialog from "@/components/generic/alert/ConfirmDialog";

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
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = React.useState(false)
  const [selectedReviewId, setSelectedReviewId] = React.useState<string | null>(null)

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

  const handleDeleteReview = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsConfirmDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedReviewId) return;

    try {
      await deleteReview(selectedReviewId);
      setReviews((prev) => prev.filter((review) => review.id !== selectedReviewId));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsConfirmDialogVisible(false);
      setSelectedReviewId(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmDialogVisible(false);
    setSelectedReviewId(null);
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
      <ReviewList reviews={reviews} userDetails={userDetails} onDelete={handleDeleteReview} />
      {isConfirmDialogVisible && (
        <ConfirmDialog
          message="Are you sure you want to delete this review?"
          onConfirm={confirmDelete} // Confirm deletion
          onCancel={cancelDelete} // Cancel deletion
        />
      )}
    </div>
  )
}

type ReviewListProps = {
  reviews: ReviewResponse[],
  userDetails: { username: string } | null,
  onDelete: (id: string) => void;
}

function ReviewList({ reviews, userDetails, onDelete }: ReviewListProps) {
  return (
    <div className="flex flex-col gap-3">
      { reviews.map((review, index) => (
        <ReviewListItem
          review={review}
          key={index}
          userDetails={userDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

type ReviewListItemProps = {
  review: ReviewResponse,
  userDetails: { username: string } | null,
  onDelete: (id: string) => void;
}

function ReviewListItem({ review, userDetails, onDelete }: ReviewListItemProps) {
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
        {review.username === userDetails?.username && (
          <button
            onClick={() => onDelete(review.id)} // Pass the review ID to the delete handler
            className="text-red-500 hover:text-red-700 p-1 rounded-full focus:outline-none"
            title="Delete Review"
          >
            Delete
          </button>
        )}
      </div>
      <ReviewItemStars rating={review.rating}/>
      <p className="details">{review.reviewBody}</p>
    </div>
  )
}
