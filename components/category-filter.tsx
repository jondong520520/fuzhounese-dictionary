'use client'

import { cn } from '@/lib/utils'
import { categories as defaultCategories } from '@/lib/dictionary-categories'

export type CategoryOption = {
  id: string
  label: string
  icon: string
}

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
  categories?: CategoryOption[]
}

export function CategoryFilter({
  selected,
  onSelect,
  categories = defaultCategories,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            'border-2',
            selected === category.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:border-accent hover:bg-secondary'
          )}
        >
          <span className="mr-1.5">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  )
}
