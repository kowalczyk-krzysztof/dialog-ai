import { type RefObject, useEffect, useState } from 'react'

export const useIsInViewport = (ref: RefObject<HTMLElement>) => {
  const [isIntersectingWithViewport, setIntersectingWithViewport] = useState(false)

  useEffect(() => {
    if (ref?.current) {
      const observer = new IntersectionObserver(([viewport]) => setIntersectingWithViewport(viewport.isIntersecting))

      observer.observe(ref.current)
      return () => {
        observer.disconnect()
      }
    }
  }, [ref])

  return isIntersectingWithViewport
}
