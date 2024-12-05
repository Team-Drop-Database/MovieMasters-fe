"use server"

export async function requestReviewsByAmount(amount: number): Promise<ReviewResponse[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/reviews/${amount}`
  const response = await fetch(url)

  if (response.status !== 200) return []

  const responseBody: ReviewResponse[] = await response.json()
  return responseBody
}

export type ReviewResponse = {
  id: string
  username: string
  userProfilePicture: string
  movieTitle: string
  rating: number
  reviewBody: string
}
