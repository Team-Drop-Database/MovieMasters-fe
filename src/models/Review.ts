export type ReviewResponse = {
  id: string
  userId: number
  username: string
  userProfilePicture: string
  movieTitle: string
  rating: number
  reviewBody: string
}

export type WatchListReview = {
  reviewId: number;
  rating: number;
  comment: string;
  reviewDate: Date;
}
