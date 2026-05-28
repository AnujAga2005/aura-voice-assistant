import styles from './MicButton.module.css'

function getStateClass(appState) {
  switch (appState) {
    case 'idle':
      return styles.idle
    case 'listening':
      return styles.listening
    case 'thinking':
    case 'speaking':
      return styles.disabled
    default:
      return styles.idle
  }
}

export default function MicButton({ appState, onClick }) {
  const stateClass = getStateClass(appState)

  return (
    <button
      className={`${styles.button} ${stateClass}`}
      onClick={onClick}
      aria-label={appState === 'listening' ? 'Stop listening' : 'Start listening'}
      id="mic-button"
    >
      <svg
        className={styles.micIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mic body */}
        <rect
          x="9"
          y="2"
          width="6"
          height="11"
          rx="3"
          fill="currentColor"
        />
        {/* Mic arc */}
        <path
          d="M5 11a7 7 0 0 0 14 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Stem */}
        <line
          x1="12"
          y1="18"
          x2="12"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Base */}
        <line
          x1="9"
          y1="22"
          x2="15"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
