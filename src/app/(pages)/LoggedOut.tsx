import React from "react"
import Image from "next/image"
import { Star } from "@/components/generic/review/Star"
import { requestReviewsByAmount } from "@/services/ReviewService"
import { mapReviewResponsesToItems, ReviewItemProps } from "@/utils/mapper/ReviewResponseMaps"
import neutral from "@/assets/images/no-profile-pic.jpg"
import BasicTransitionLink from "@/components/generic/transitions/BasicTransitionLink"
import ElementTransition from "@/components/generic/transitions/ElementTransition"
import TransitionLink from "@/components/generic/transitions/TransitionLink"

export default function LoggedOut() {
  return (
    <>
      {/* <div className="mx-[4rem] mt-[4rem] flex flex-col">
        <h1>Welcome to Movie Master</h1>
        <p>Discover movies. Connect with friends. Join the fun.</p>
      </div> */}
      {/* <div className="mx-[4rem] flex gap-5">
        <BasicTransitionLink href={"/signup"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Sign up</div>
          </BasicTransitionLink>
          <BasicTransitionLink href={"/signin"}>
          <div className="py-2 px-3 bg-blue-800 rounded-md text-xl">Log in</div>
          </BasicTransitionLink>
      </div> */}
      <section className="flex w-full min-h-[800px] justify-evenly p-24 pt-32 bg-gradient-to-b from-background_primary via-slate-600 to-background_primary">
        {/* <div className="">
        </div> */}
        {/* <img className="opacity-70" src={"https://img.freepik.com/premium-photo/vintage-people-watching-movie-cinema-wearing-3d-glasses-photography-portrait-adult_53876-316632.jpg"} width={800} height={800} alt={"popcorn.png"}></img> */}
        {/* <Image className="opacity-100" src={"/popcorn2_sharp.png"} width={800} height={800} alt="popcorn.png"></Image> */}
        <ElementTransition startYState={-50}>
          <div className="flex flex-col gap-3 max-w-[550px] items-center">
            <h1 className="text-white text-5xl font-inter font-bold text-center">Movies made <span className="text-blue-500">social</span>.</h1>
            <p className="font-inter text-white text-2xl opacity-70 text-center mb-5">Explore the latest blockbusters, share reviews, and connect with fellow film lovers.</p>
            <BasicTransitionLink href="/movies/129">
              <button className="opacity-60 hover:opacity-100 px-4 py-2 rounded-2xl bg-indigo-500 hover:ring-1 hover:scale-105 shadow-md font-inter text-2xl font-semibold transition-all">Start Browsing</button>
            </BasicTransitionLink>
          </div>
        </ElementTransition>
      </section>
      <ReviewList />
    </>
  )
}

function ReviewList() {
  const reviewAmount = 10
  const [reviewList, setReviewList] = React.useState<ReviewItemProps[]>([])
  const sliderRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    async function loadReviews() {
      const reviewResponse = await requestReviewsByAmount(reviewAmount)
      const mappedResponse = mapReviewResponsesToItems(reviewResponse)

      if (mappedResponse.length === 0) return
      const multiplier = reviewAmount / mappedResponse.length
      const multiplied: ReviewItemProps[] = []
      for (let i = 0; i < multiplier; i++) {
        multiplied.push(...mappedResponse)
      }
      setReviewList(multiplied)
    }

    loadReviews()
  }, [])

  return (
    <div className="h-72 overflow-hidden mb-[4rem]">
      <div ref={sliderRef} className={`animate-slide w-fit flex gap-16`}>
        { [...reviewList, ...reviewList].map((review, index) => {
          return <ReviewItem 
            reviewerName={review.reviewerName}
            profilePicture={review.profilePicture}
            movieName={review.movieName}
            starAmount={review.starAmount}
            reviewBody={review.reviewBody}
            key={index}
          />
        })}
      </div>
    </div>
  )
}

function ReviewItem(props: ReviewItemProps) {
  return (
    <div className="h-72 w-72 p-2 shrink-0 flex flex-col rounded-xl shadow-lg border-background_secondary border-4 gap-5">
      <div className="flex items-start gap-2">
        <Image
          src={props.profilePicture || neutral}
          width={45}
          height={45}
          alt="Profile picture"
          className="rounded-full"
        />
        <p className="details grow">{props.reviewerName}</p>
      </div>
      <ReviewItemStars starAmount={props.starAmount} />
      <p className="details">On: {props.movieName}</p>
      <p className="details">{props.reviewBody}</p>
    </div>
  )
}

type ReviewItemStarsProps = {
  starAmount: number
}

function ReviewItemStars({ starAmount }: ReviewItemStarsProps) {
  return (
    <div className="flex gap-2">
      <Star isYellow={starAmount >= 1} />
      <Star isYellow={starAmount >= 2} />
      <Star isYellow={starAmount >= 3} />
      <Star isYellow={starAmount >= 4} />
      <Star isYellow={starAmount >= 5} />
    </div>
  )
}
