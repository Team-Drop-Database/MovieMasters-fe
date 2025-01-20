import { useAuthContext } from "@/contexts/AuthContext"
import PostReviewContainer from "./PostReviewContainer"
import { ReviewResponse } from "@/models/Review"
import React from "react"
import {deleteReview, getReviewsByMovie} from "@/services/ReviewService"
import Image from "next/image"
import { ReviewItemStars } from "@/components/generic/review/StarContainer"
import Anonymous from "@/assets/images/no-profile-pic.jpg"
import ConfirmDialog from "@/components/generic/alert/ConfirmDialog"
import DeleteIcon from "@/assets/images/delete/delete.svg"
import HoveredDeleteIcon from "@/assets/images/delete/delete-hover.svg"
import ReportIcon from "@/assets/images/flag/flag.svg"
import HoveredReportIcon from "@/assets/images/flag/flag-hover.svg"
import { reportUser } from "@/services/ReportService"

type ReviewSectionProps = {
  movieId: number,
  hasWatched: boolean,
  onReviewCreated: (review: ReviewResponse) => void,
  onReviewDeleted: () => void,
  className?: string,
}

export default function ReviewSection({ movieId, hasWatched, onReviewCreated, onReviewDeleted, className = "" }: ReviewSectionProps) {
  const { isLoggedIn, userDetails } = useAuthContext()
  const [reviews, setReviews] = React.useState<ReviewResponse[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = React.useState(false)
  const [selectedReviewId, setSelectedReviewId] = React.useState<string | null>(null)
  const [isReportDialogVisible, setIsReportDialogVisible] = React.useState(false)
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null)
  const [reportReason, setReportReason] = React.useState("")

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

  const onReport = (userId: number) => {
    setSelectedUserId(userId)
    setIsReportDialogVisible(true)
  }

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
      onReviewDeleted();
    }
  };

  const cancelDelete = () => {
    setIsConfirmDialogVisible(false);
    setSelectedReviewId(null);
  };

  React.useEffect(() => {
    void retrieveReviews();
  }, []);

  return (
    <div className={`${className} flex flex-col gap-2`}>
      { isLoggedIn && userDetails?.userId !== undefined && hasWatched &&
        <PostReviewContainer movieId={movieId} userId={userDetails?.userId} onReviewPosted={(newReview) => {
          retrieveReviews().then((): void => {
            onReviewCreated(newReview);
          });
        }} />
      }
      { errorMessage && <div className="text-red-800">{errorMessage}</div> }
      <ReviewList reviews={reviews} userDetails={userDetails} onDelete={handleDeleteReview} onReport={onReport} />
      {isConfirmDialogVisible && (
        <ConfirmDialog
          message="Are you sure you want to delete this review?"
          onConfirm={confirmDelete} // Confirm deletion
          onCancel={cancelDelete} // Cancel deletion
        />
      )}
      { isReportDialogVisible && selectedUserId && (
        <ConfirmDialog
          message="Please enter reason for report"
          onConfirm={() => {
            reportUser(selectedUserId, reportReason)
            setIsReportDialogVisible(false)
            setReportReason("")
          }}
          onCancel={() => {
            setIsReportDialogVisible(false)
            setReportReason("")
          }}
          textFieldProps={{ value: reportReason, onChange: setReportReason, placeholder: "Reason for report" }}
        />
      )}
    </div>
  )
}

type ReviewListProps = {
  reviews: ReviewResponse[]
  userDetails: { username: string } | null
  onDelete: (id: string) => void
  onReport: (userId: number) => void
}

function ReviewList({ reviews, userDetails, onDelete, onReport }: ReviewListProps) {
  return (
    <div className="flex flex-col gap-3">
      { reviews.map((review, index) => (
        <ReviewListItem
          review={review}
          key={index}
          userDetails={userDetails}
          onDelete={onDelete}
          onReport={onReport}
        />
      ))}
    </div>
  )
}

type ReviewListItemProps = {
  review: ReviewResponse
  userDetails: { username: string } | null
  onDelete: (id: string) => void
  onReport: (userId: number) => void
}

function ReviewListItem({ review, userDetails, onDelete, onReport }: ReviewListItemProps) {
  return (
    <div className="p-2 shrink-0 flex rounded-xl shadow-lg border border-background_secondary justify-between items-start">
      <div className="flex flex-col gap-2">
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
        <ReviewItemStars rating={review.rating}/>
        <p className="details">{review.reviewBody}</p>
      </div>
      <ReviewActionContainer review={review} userDetails={userDetails} onDelete={onDelete} onReport={onReport} />
    </div>
  )
}

type ReviewActionContainerProps = {
  review: ReviewResponse
  userDetails: { username: string } | null
  onDelete: (id: string) => void
  onReport: (userId: number) => void
}

function ReviewActionContainer({ review, userDetails, onDelete, onReport }: ReviewActionContainerProps) {
  const [reportHover, setReportHover] = React.useState(false)
  const [deleteHover, setDeleteHover] = React.useState(false)

  return (
    <div className="flex">
      <Image
        src={reportHover ? HoveredReportIcon : ReportIcon}
        alt="Report"
        title="Report"
        width={25}
        height={25}
        className="hover:cursor-pointer"
        onClick={() => onReport(review.userId)}
        onMouseEnter={() => setReportHover(true)}
        onMouseLeave={() => setReportHover(false)}
      />
      {review.username === userDetails?.username && (
        <Image
          src={deleteHover ? HoveredDeleteIcon : DeleteIcon}
          alt="Delete"
          title="Delete"
          width={25}
          height={25}
          className="hover:cursor-pointer"
          onClick={() => onDelete(review.id)}
          onMouseEnter={() => setDeleteHover(true)}
          onMouseLeave={() => setDeleteHover(false)}
        />
      )}
    </div>
  )
}
