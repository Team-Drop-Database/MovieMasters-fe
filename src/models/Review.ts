
export type Review = {
    reviewId: number;
    // Might uncomment later (but probably not):
    //userMovie: WatchListItem;
    rating: number;
    comment: string;
    reviewDate: Date;
};

export default Review;