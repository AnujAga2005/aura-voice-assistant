import { useMemo } from 'react'
import styles from './Avatar.module.css'

const stateConfig = {
  idle: {
    eyeRy: 7,
    eyeCy: 100,
    mouthRy: 2,
    browTransform: 'translateY(0)',
  },
  listening: {
    eyeRy: 9,
    eyeCy: 100,
    mouthRy: 5,
    browTransform: 'translateY(-2px)',
  },
  thinking: {
    eyeRy: 5,
    eyeCy: 96,
    mouthRy: 2,
    browTransform: 'translateY(-3px) rotate(-3deg)',
  },
  speaking: {
    eyeRy: 7,
    eyeCy: 100,
    mouthRy: 3,
    browTransform: 'translateY(0)',
  },
}

export default function Avatar({ state = 'idle', mouthOpen = false }) {
  const config = stateConfig[state] || stateConfig.idle

  const mouthRy = useMemo(() => {
    if (state === 'speaking') {
      return mouthOpen ? 9 : 3
    }
    return config.mouthRy
  }, [state, mouthOpen, config.mouthRy])

  const animationClass = styles[state] || styles.idle
  const transitionStyle = { transition: 'all 0.25s ease' }

  return (
    <div className={`${styles.wrapper} ${animationClass}`}>
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face ring */}
        <circle
          className={styles.faceRing}
          cx="100"
          cy="100"
          r="98"
          style={{
            stroke: 'var(--face-ring)',
            strokeWidth: 1,
            fill: 'none',
            ...transitionStyle,
          }}
        />

        {/* Face background */}
        <circle
          cx="100"
          cy="100"
          r="90"
          style={{
            fill: 'var(--face-bg)',
            ...transitionStyle,
          }}
        />

        {/* Brows */}
        <g style={{ transform: config.browTransform, transformOrigin: '100px 78px', ...transitionStyle }}>
          <line
            x1="72" y1="78" x2="88" y2="74"
            style={{
              stroke: 'var(--accent)',
              strokeOpacity: 0.5,
              strokeWidth: 1.5,
              strokeLinecap: 'round',
              ...transitionStyle,
            }}
          />
          <line
            x1="112" y1="74" x2="128" y2="78"
            style={{
              stroke: 'var(--accent)',
              strokeOpacity: 0.5,
              strokeWidth: 1.5,
              strokeLinecap: 'round',
              ...transitionStyle,
            }}
          />
        </g>

        {/* Left eye */}
        <ellipse
          cx="82"
          cy={config.eyeCy}
          rx="7"
          ry={config.eyeRy}
          style={{
            fill: 'var(--accent)',
            fillOpacity: 0.85,
            ...transitionStyle,
          }}
        />

        {/* Right eye */}
        <ellipse
          cx="118"
          cy={config.eyeCy}
          rx="7"
          ry={config.eyeRy}
          style={{
            fill: 'var(--accent)',
            fillOpacity: 0.85,
            ...transitionStyle,
          }}
        />

        {/* Mouth */}
        <ellipse
          cx="100"
          cy="125"
          rx="10"
          ry={mouthRy}
          style={{
            fill: 'var(--accent)',
            fillOpacity: 0.6,
            ...transitionStyle,
          }}
        />
      </svg>
    </div>
  )
}
