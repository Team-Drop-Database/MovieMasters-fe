import { getFillAmount, Star } from "./Star"

type ReviewItemStarsProps = {
  rating: number
}

export function ReviewItemStars({ rating }: ReviewItemStarsProps) {
  return (
    <div className="flex gap-2">
      <Star fillAmount={getFillAmount(rating, 1)} />
      <Star fillAmount={getFillAmount(rating, 2)} />
      <Star fillAmount={getFillAmount(rating, 3)} />
      <Star fillAmount={getFillAmount(rating, 4)} />
      <Star fillAmount={getFillAmount(rating, 5)} />
    </div>
  )
}