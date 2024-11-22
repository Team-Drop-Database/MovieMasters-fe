import { ReviewResponse } from "@/services/ReviewService";

export function mapReviewResponsesToItems(responses: ReviewResponse[]): ReviewItemProps[] {
  return responses.map(mapReviewResponseToItem)
}

export function mapReviewResponseToItem(response: ReviewResponse): ReviewItemProps {
  const maxLength = 60
  let reviewBody = response.reviewBody
  if (reviewBody.length > maxLength) {
    reviewBody = `${reviewBody.substring(0, maxLength)}...`
  }

  return {
    reviewerName: response.username,
    profilePicture: response.userProfilePicture,
    movieName: response.movieTitle,
    starAmount: response.rating,
    reviewBody: reviewBody,
  }
}

export type ReviewItemProps = {
  reviewerName: string,
  profilePicture: string,
  movieName: string,
  starAmount: number,
  reviewBody: string,
}
