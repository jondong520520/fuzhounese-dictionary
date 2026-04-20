'use client'

import { cn } from '@/lib/utils'
import { categories } from '@/lib/dictionary-data'

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border-2",
            selected === category.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border/50 hover:border-primary/50 hover:bg-secondary"
          )}
        >
          <span className="mr-1.5">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  )
}
