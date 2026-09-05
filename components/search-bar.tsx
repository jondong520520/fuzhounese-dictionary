'use client'

import { Search, X } from 'lucide-react'
import type { KeyboardEventHandler, Ref } from 'react'
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
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onFocus?: () => void
  inputRef?: Ref<HTMLInputElement>
  id?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-activedescendant'?: string
  'aria-autocomplete'?: 'list' | 'none'
  role?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search in Fuzhounese, Chinese, or English...',
  size = 'default',
  autoFocus = false,
  onKeyDown,
  onFocus,
  inputRef,
  id,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
  'aria-activedescendant': ariaActiveDescendant,
  'aria-autocomplete': ariaAutocomplete,
  role,
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
        ref={inputRef}
        id={id}
        type="text"
        role={role}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-activedescendant={ariaActiveDescendant}
        aria-autocomplete={ariaAutocomplete}
        className={cn(
          'bg-card border-border/50 shadow-sm',
          isHero
            ? cn(
                'h-14 rounded-2xl border-white/80 bg-white pl-14 pr-14 text-base text-foreground shadow-md sm:h-16 sm:text-lg',
                'transition-[box-shadow,border-color,transform]',
                motionDuration,
                motionEase,
                'hover:shadow-lg',
                'focus:border-primary/55 focus:shadow-lg',
                'focus-visible:border-primary/70 focus-visible:shadow-lg focus-visible:ring-primary/35',
                'motion-reduce:transition-none motion-reduce:hover:shadow-md'
              )
            : 'h-14 rounded-2xl pl-12 pr-12 text-base transition-shadow focus:shadow-md'
        )}
      />
      {value ? (
        <Button
          type="button"
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
