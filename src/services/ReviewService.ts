import { ReviewResponse } from "@/models/Review"
import apiClient from "./ApiClient"

/**
 * Retrieves a given amount of reviews of no specific movie
 * @param amount  The amount of reviews you wish to obtain
 * @returns       A given amount of reviews
 */
export async function requestReviewsByAmount(amount: number): Promise<ReviewResponse[]> {
  const url = `/reviews/${amount}`
  const response = await apiClient(url)

  if (response.status !== 200) return []

  const responseBody: ReviewResponse[] = await response.json()
  return responseBody
}

/**
 * Posts a review on a given movie
 * @param userId    The user that places the review
 * @param movieId   The movie reviewed
 * @param rating    The rating out of 10
 * @param comment   The text that the user supplied
 * @returns         The created review as a ReviewResponse
 */
export async function postReview(userId: number, movieId: number, rating: number, comment: string): Promise<ReviewResponse> {
  const url = `/reviews`
  const requestBody = {
    "userId": userId,
    "movieId": movieId,
    "rating": rating,
    "comment": comment,
  }
  const response = await apiClient(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
  })

  if (response.status !== 201) {
    throw Error("Review could not be posted")
  }

  return await response.json()
}

/**
 * Returns the reviews posted about a movie
 * @param movieId   The movie that you'd like to obtain the reviews for
 * @returns         Reviews posted about the given movie
 */
export async function getReviewsByMovie(movieId: number): Promise<ReviewResponse[]> {
  const url = `/reviews/movie?movieId=${movieId}`
  const response = await apiClient(url)

  if (response.status !== 200) {
    throw Error("Reviews were not obtained successfully")
  }

  return await response.json()
}

export async function deleteReview(reviewId: string) {
  const url = `/reviews?reviewId=${reviewId}`;
  const response = await apiClient(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw Error(`Failed to delete review. Status: ${response.status}`);
  }

  return response.status;
}
