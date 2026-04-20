'use client'

import { useState, useRef } from 'react'
import { Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { DictionaryEntry } from '@/lib/dictionary-data'
import { cn } from '@/lib/utils'

interface WordCardProps {
  entry: DictionaryEntry
}

export function WordCard({ entry }: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null)

  const playAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Use Web Speech API for demonstration
    // In production, you'd use actual Fuzhounese audio files
    const utterance = new SpeechSynthesisUtterance(entry.chinese)
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

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg border-border/50",
      "bg-card hover:bg-card/80"
    )}>
      <CardContent className="p-0">
        <div className="p-5">
          {/* Main content row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Fuzhounese character - large and prominent */}
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-2 tracking-wide">
                {entry.fuzhounese}
              </h3>
              
              {/* Romanization */}
              <p className="text-lg text-primary font-medium mb-3 italic">
                {entry.romanization}
              </p>
              
              {/* Definitions */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="inline-block w-8 text-xs uppercase tracking-wider opacity-60">中</span>
                  {entry.chinese}
                </p>
                <p className="text-sm text-foreground/80">
                  <span className="inline-block w-8 text-xs uppercase tracking-wider text-muted-foreground opacity-60">EN</span>
                  {entry.english}
                </p>
              </div>
            </div>

            {/* Audio button */}
            <Button
              variant="outline"
              size="icon"
              onClick={playAudio}
              disabled={hasError}
              className={cn(
                "h-14 w-14 rounded-full border-2 transition-all duration-300 shrink-0",
                isPlaying 
                  ? "bg-primary text-primary-foreground border-primary scale-110" 
                  : "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
              )}
            >
              {hasError ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className={cn(
                  "h-6 w-6 transition-transform",
                  isPlaying && "animate-pulse"
                )} />
              )}
            </Button>
          </div>

          {/* Examples section */}
          {entry.examples && entry.examples.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>Example sentences</span>
              </button>
              
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  {entry.examples.map((example, idx) => (
                    <div 
                      key={idx} 
                      className="pl-4 border-l-2 border-accent/50 space-y-1"
                    >
                      <p className="font-serif text-lg text-foreground">
                        {example.fuzhounese}
                      </p>
                      <p className="text-sm text-primary italic">
                        {example.romanization}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {example.english}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category tag */}
        <div className="px-5 pb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
            {entry.category}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
