"use client"

export type ButtonProps = {
  text: string,
  onClick: () => void,
}

export function Button(props: ButtonProps) {
  return (
    <div 
      onClick={props.onClick}
      className="drop-shadow-lg rounded px-3 py-1 bg-accent_blue hover:bg-accent_blue_active hover:duration-300 hover:cursor-pointer font-[family-name:var(--font-alatsi)]"
    >
      {props.text}
    </div>
  )
}
