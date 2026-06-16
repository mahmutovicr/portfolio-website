import { useEffect, useRef } from 'react'
import { useHoverDevice } from '../hooks/useHoverDevice'

export function Spotlight() {
  const canHover = useHoverDevice()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canHover) return
    const handler = (e: MouseEvent) => {
      if (!ref.current) return
      ref.current.style.left = e.clientX + 'px'
      ref.current.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [canHover])

  return <div id="spotlight" ref={ref} />
}