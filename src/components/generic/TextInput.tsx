type TextInputProps = {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
  className?: string
}

export default function TextInput(
  { value, onChange, placeholder = "Enter text", className = "" }: TextInputProps
) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={"outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey " +
                  "hover:bg-light_grey_active hover:duration-300 hover:cursor-text " +
                  `font-[family-name:var(--font-jura)] ${className}`}
    />
  )
}
