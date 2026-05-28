import { useRef, useCallback, useMemo } from 'react'

export function useSpeechRecognition() {
  const recognitionRef = useRef(null)

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }, [])

  const startListening = useCallback(({ onResult, onError, onEnd }) => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult?.(transcript)
    }

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error)
      onError?.(event.error)
    }

    recognition.onend = () => {
      onEnd?.()
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
  }, [])

  return { startListening, stopListening, isSupported }
}
