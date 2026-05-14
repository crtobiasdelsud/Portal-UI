'use client'

import { SpeechProvider } from '../../context/SpeechContext.jsx'
import SpeechPlayerBar from '../SpeechPlayerBar/SpeechPlayerBar.jsx'

export default function SpeechProviderWrapper({ children }) {
  return (
    <SpeechProvider>
      {children}
      <SpeechPlayerBar />
    </SpeechProvider>
  )
}
