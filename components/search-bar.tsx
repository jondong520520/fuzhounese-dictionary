'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    <div className="relative">
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
          isHero ? 'left-5 h-5 w-5' : 'left-4 h-5 w-5'
        )}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={cn(
          'bg-card border-border/50 shadow-sm transition-shadow focus:shadow-md',
          isHero
            ? 'h-14 rounded-2xl pl-14 pr-14 text-base sm:h-16 sm:text-lg'
            : 'h-14 rounded-2xl pl-12 pr-12 text-base'
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
