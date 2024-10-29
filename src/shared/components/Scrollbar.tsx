import { ScrollAreaCorner, ScrollAreaScrollbar, ScrollAreaThumb } from '@radix-ui/react-scroll-area'

interface Props {
  orientation?: 'vertical' | 'horizontal'
}

export const Scrollbar = ({ orientation = 'vertical' }: Props) => (
  <>
    <ScrollAreaScrollbar orientation={orientation} className='w-2 bg-tertiary rounded-lg'>
      <ScrollAreaThumb className='bg-primary rounded-lg hover:bg-primary-hover' />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </>
)
