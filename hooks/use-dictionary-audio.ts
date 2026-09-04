'use client'

import { useRef, useState } from 'react'

export function useDictionaryAudio(chinese: string) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null)

  const playAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(chinese)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.7

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => {
      setIsPlaying(false)
      setHasError(true)
    }

    audioRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  return { playAudio, isPlaying, hasError }
}
