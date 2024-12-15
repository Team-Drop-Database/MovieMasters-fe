import { CSSProperties, SVGAttributes } from "react"

export enum FillAmount {
  EMPTY,
  HALF,
  FULL,
}

export type StarProps = {
  fillAmount: FillAmount
  setHalfHoverAmount: () => void
  setFullHoverAmount: () => void
  confirmHalfStarAmount: () => void
  confirmFullStarAmount: () => void
  className?: string
}

export function getFillAmount(starAmount: number, starNumber: number): FillAmount {
  let fullValue = starNumber * 2
  let halfValue = fullValue - 1

  if (starAmount >= fullValue) {
    return FillAmount.FULL
  } else if (starAmount >= halfValue) {
    return FillAmount.HALF
  } else {
    return FillAmount.EMPTY
  }
}

export function Star({
  fillAmount, setHalfHoverAmount, setFullHoverAmount,
  confirmHalfStarAmount, confirmFullStarAmount, className = "",
}: StarProps) {
  let leftColor: string
  let rightColor: string

  switch (fillAmount) {
    case FillAmount.EMPTY: {
      leftColor = "var(--background-secondary)"
      rightColor = "var(--background-secondary)"
      break
    }
    case FillAmount.HALF: {
      leftColor = "var(--accent-yellow)"
      rightColor = "var(--background-secondary)"
      break
    }
    case FillAmount.FULL: {
      leftColor = "var(--accent-yellow)"
      rightColor = "var(--accent-yellow)"
      break
    }
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_225_147" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="16" y="0" width="16" height="32">
        <rect x="16" width="16" height="32" fill="#EEFF00"/>
      </mask>
      <g mask="url(#mask0_225_147)">
        <path d="M16 1.61804 L19.1167 11.2102 L19.229 11.5557 H19.5922 H29.6781 L21.5184 17.484 L21.2246 17.6976 L21.3368 18.0431 L24.4535 27.6353 L16.2939 21.7069 L16 21.4934Z" fill={rightColor} stroke="black"/>
        <rect onMouseEnter={setFullHoverAmount} onClick={confirmFullStarAmount} x="16" y="0" width="16" height="32" fill="#FFFFFF00" />
      </g>
      <mask id="mask1_225_147" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="32">
        <rect width="16" height="32" fill="#EEFF00"/>
      </mask>
      <g mask="url(#mask1_225_147)">
        <path d="M16 21.4934 L15.7061 21.7069 L7.54649 27.6353 L10.6632 18.0431 L10.7754 17.6976 L10.4816 17.484 L2.32194 11.5557 H12.4078 H12.771 L12.8833 11.2102 L16 1.61804Z" fill={leftColor} stroke="black"/>
        <rect onMouseEnter={setHalfHoverAmount} onClick={confirmHalfStarAmount} x="0" y="0" width="16" height="32" fill="#FFFFFF00" />
      </g>
    </svg>
  )
}
