import { useRef, useCallback, useMemo } from 'react'

export function useSpeechSynthesis() {
  const utteranceRef = useRef(null)

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }, [])

  const getPreferredVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()
    const preferredNames = ['Samantha', 'Google US English', 'Karen']

    // Try to find a preferred voice
    for (const name of preferredNames) {
      const match = voices.find(
        (v) => v.lang.startsWith('en') && v.name.includes(name)
      )
      if (match) return match
    }

    // Fallback to first en-US voice
    const enUS = voices.find((v) => v.lang === 'en-US')
    if (enUS) return enUS

    // Fallback to any English voice
    const anyEn = voices.find((v) => v.lang.startsWith('en'))
    if (anyEn) return anyEn

    return null
  }, [])

  const speak = useCallback((text, { onBoundary, onEnd } = {}) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    const voice = getPreferredVoice()
    if (voice) {
      utterance.voice = voice
    }

    utterance.onboundary = (event) => {
      onBoundary?.(event)
    }

    utterance.onend = () => {
      utteranceRef.current = null
      onEnd?.()
    }

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error)
      utteranceRef.current = null
      onEnd?.()
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, getPreferredVoice])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
  }, [isSupported])

  return { speak, cancel, isSupported }
}
