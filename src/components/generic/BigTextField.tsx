type BigTextFieldProps = {
  value: string
  onValueChange: (newValue: string) => void
  className?: string | null
  maxLength?: number
  placeholder?: string
}

export default function BigTextField({
  value, onValueChange, className = "", maxLength = 1000, placeholder = "Enter text"
}: BigTextFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${className} outline-none placeholder-black rounded-md
        text-black py-1 px-2 bg-light_grey hover:bg-light_grey_active resize-none
        duration-300 hover:duration-300 font-[family-name:var(--font-jura)]`}
    />
  )
}
