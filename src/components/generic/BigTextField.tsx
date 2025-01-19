type BigTextFieldProps = {
  value: string,
  onValueChange: (newValue: string) => void,
  placeholder?: string;
  className?: string | null,
  maxLength?: number,
}

export default function BigTextField({
  value, onValueChange, className = "", placeholder, maxLength = 1000,
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
