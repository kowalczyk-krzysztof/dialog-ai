interface Props {
  text: string
  id: string
}

export const LanguagePairLabel = ({ id, text }: Props) => (
  <label
    className='absolute top-0 left-1 text-[10px] pt-0.5 flex uppercase select-none opacity-90 text-primary hover:text-primary-hover font-bold'
    htmlFor={id}
  >
    {text}
  </label>
)
