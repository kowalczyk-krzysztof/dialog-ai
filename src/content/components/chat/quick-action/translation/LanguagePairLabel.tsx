interface Props {
  text: string
  id: string
}

export const LanguagePairLabel = ({ id, text }: Props) => (
  <label
    className='absolute left-1 top-0 flex select-none text-xs font-bold uppercase text-primary opacity-90 hover:text-primary-hover'
    htmlFor={id}
  >
    {text}
  </label>
)
