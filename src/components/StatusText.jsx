import { useState, useEffect, useRef } from 'react'
import styles from './StatusText.module.css'

export default function StatusText({ text }) {
  const [displayText, setDisplayText] = useState(text)
  const [transitioning, setTransitioning] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (text === displayText) return

    // Start transition out
    setTransitioning(true)

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // After fade-out, swap text and fade-in
    timeoutRef.current = setTimeout(() => {
      setDisplayText(text)
      setTransitioning(false)
    }, 150)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, displayText])

  const className = transitioning
    ? `${styles.status} ${styles.transitioning}`
    : styles.status

  return (
    <p className={className} id="status-text">
      {displayText}
    </p>
  )
}
