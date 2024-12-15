type BigTextFieldProps = {
  value: string,
  onValueChange: (newValue: string) => void,
  className?: string | null
}

export default function BigTextField({ 
  value, onValueChange, className = "", 
}: BigTextFieldProps) {
  return (
    <textarea 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      placeholder="Type your review here"
      maxLength={1000 /* TODO: place this in constants */}
      className={`${className} outline-none placeholder-black rounded-md
        text-black py-1 px-2 bg-light_grey hover:bg-light_grey_active resize-none
        duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
    />
  )
}
