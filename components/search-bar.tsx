'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const motionEase = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const motionDuration = 'duration-[250ms]'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: 'default' | 'hero'
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search in Fuzhounese, Chinese, or English...',
  size = 'default',
  autoFocus = false,
}: SearchBarProps) {
  const isHero = size === 'hero'

  return (
    <div
      className={cn(
        'relative',
        isHero &&
          cn(
            'group origin-center',
            'transition-transform',
            motionDuration,
            motionEase,
            'hover:-translate-y-px',
            'focus-within:scale-[1.01]',
            'motion-reduce:transition-none',
            'motion-reduce:hover:translate-y-0',
            'motion-reduce:focus-within:scale-100'
          )
      )}
    >
      <Search
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground',
          isHero ? 'left-5 h-5 w-5' : 'left-4 h-5 w-5',
          isHero &&
            cn(
              'transition-[color,opacity]',
              motionDuration,
              motionEase,
              'group-focus-within:text-foreground group-focus-within:opacity-100',
              'motion-reduce:transition-none'
            )
        )}
        aria-hidden
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={cn(
          'bg-card border-border/50 shadow-sm',
          isHero
            ? cn(
                'h-14 rounded-2xl pl-14 pr-14 text-base sm:h-16 sm:text-lg',
                'transition-[box-shadow,border-color]',
                motionDuration,
                motionEase,
                'hover:shadow-md',
                // focus (mouse click) + focus-visible (keyboard) — not tied to typing
                'focus:border-primary/55 focus:shadow-md',
                'focus-visible:border-primary/70 focus-visible:shadow-md focus-visible:ring-primary/35',
                'motion-reduce:transition-none motion-reduce:hover:shadow-sm'
              )
            : 'h-14 rounded-2xl pl-12 pr-12 text-base transition-shadow focus:shadow-md'
        )}
      />
      {value ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
