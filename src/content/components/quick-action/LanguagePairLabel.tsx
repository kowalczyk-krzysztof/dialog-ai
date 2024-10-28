interface Props {
  text: string
  id: string
}

export const LanguagePairLabel = ({ id, text }: Props) => (
  <label
    className='absolute -top-5 left-1 text-xs pt-0.5 flex uppercase select-none opacity-90 text-primary hover:text-primary-hover font-bold'
    htmlFor={id}
  >
    {text}
  </label>
)
