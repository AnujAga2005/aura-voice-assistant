import { useState, useRef, useCallback } from 'react'
import styles from './App.module.css'
import Avatar from './components/Avatar'
import MicButton from './components/MicButton'
import StatusText from './components/StatusText'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'

const API_URL = import.meta.env.VITE_API_URL || ''

const STATUS_MAP = {
  idle: 'ready',
  listening: 'listening...',
  thinking: 'thinking...',
  speaking: 'speaking',
}

export default function App() {
  const [state, setState] = useState('idle')
  const [statusOverride, setStatusOverride] = useState(null)
  const [mouthOpen, setMouthOpen] = useState(false)

  const historyRef = useRef([])
  const mouthTimerRef = useRef(null)
  const errorTimerRef = useRef(null)

  const { startListening, stopListening, isSupported: sttSupported } = useSpeechRecognition()
  const { speak, cancel: cancelSpeech, isSupported: ttsSupported } = useSpeechSynthesis()

  const isSupported = sttSupported

  // Show an error message for 2s then return to idle
  const showError = useCallback((message) => {
    setState('idle')
    setStatusOverride(message)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    errorTimerRef.current = setTimeout(() => {
      setStatusOverride(null)
    }, 2000)
  }, [])

  // Send transcript to API and get response
  const fetchReply = useCallback(async (transcript) => {
    // Append user message to history
    historyRef.current.push({ role: 'user', content: transcript })

    // Cap at last 10 messages (5 turns)
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }

    setState('thinking')

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyRef.current }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const reply = data.reply
      historyRef.current.push({ role: 'assistant', content: reply })

      // Cap again after adding assistant reply
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10)
      }

      // Move to speaking state
      setState('speaking')

      speak(reply, {
        onBoundary: () => {
          setMouthOpen(true)
          if (mouthTimerRef.current) clearTimeout(mouthTimerRef.current)
          mouthTimerRef.current = setTimeout(() => {
            setMouthOpen(false)
          }, 120)
        },
        onEnd: () => {
          setMouthOpen(false)
          setState('idle')
        },
      })
    } catch (err) {
      console.error('Chat API error:', err)
      showError('something went wrong')
    }
  }, [speak, showError])

  // Handle mic button click
  const handleMicClick = useCallback(() => {
    if (state === 'idle') {
      setState('listening')
      setStatusOverride(null)

      startListening({
        onResult: (transcript) => {
          fetchReply(transcript)
        },
        onError: () => {
          showError('try again')
        },
        onEnd: () => {
          // If still in listening state (no result received), go back to idle
          setState((prev) => {
            if (prev === 'listening') return 'idle'
            return prev
          })
        },
      })
    } else if (state === 'listening') {
      // Cancel listening and return to idle
      stopListening()
      setState('idle')
    }
  }, [state, startListening, stopListening, fetchReply, showError])

  // Browser compatibility guard
  if (!isSupported) {
    return (
      <div className={styles.unsupported}>
        <p>please open in chrome or edge</p>
        <p className={styles.sub}>web speech api is not supported in this browser</p>
      </div>
    )
  }

  const statusText = statusOverride || STATUS_MAP[state] || 'ready'

  return (
    <div className={styles.container}>
      <h1 className={styles.appName}>aura</h1>

      <div className={styles.avatarWrap}>
        <Avatar state={state} mouthOpen={mouthOpen} />
      </div>

      <div className={styles.statusWrap}>
        <StatusText text={statusText} />
      </div>

      <div className={styles.micWrap}>
        <MicButton appState={state} onClick={handleMicClick} />
      </div>

      <p className={styles.footer}>voice assistant</p>
    </div>
  )
}
