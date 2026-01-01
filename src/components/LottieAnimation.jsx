import Lottie from 'lottie-react'
import { useEffect, useRef } from 'react'

export default function LottieAnimation({ 
  animationData, 
  className = '', 
  loop = true,
  autoplay = true,
  style = {}
}) {
  const lottieRef = useRef(null)

  useEffect(() => {
    if (lottieRef.current && autoplay) {
      lottieRef.current.play()
    }
  }, [autoplay])

  return (
    <div className={className} style={style}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

