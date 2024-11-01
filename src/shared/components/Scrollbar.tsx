import { ScrollAreaCorner, ScrollAreaScrollbar, ScrollAreaThumb } from '@radix-ui/react-scroll-area'

interface Props {
  orientation?: 'vertical' | 'horizontal'
}

export const Scrollbar = ({ orientation = 'vertical' }: Props) => (
  <>
    <ScrollAreaScrollbar orientation={orientation} className='w-2 rounded-lg bg-tertiary'>
      <ScrollAreaThumb className='rounded-lg bg-primary hover:bg-primary-hover' />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </>
)
