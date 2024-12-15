import { useAuthContext } from "@/contexts/AuthContext"
import PostReviewContainer from "./PostReviewContainer"

type ReviewSectionProps = {
  movieId: number,
  className?: string | null,
}

export default function ReviewSection({ movieId, className = "" }: ReviewSectionProps) {
  const { isLoggedIn, userDetails } = useAuthContext()

  return (
    <div className={`${className} flex flex-col`}>
      { isLoggedIn && userDetails?.userId !== undefined && <PostReviewContainer movieId={movieId} userId={userDetails?.userId} /> }
    </div>
  )
}
