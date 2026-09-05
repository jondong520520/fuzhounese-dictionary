'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/browse', label: 'Browse' },
  { href: '/', label: 'Search' },
  { href: '/study', label: 'Study' },
  { href: '/favorites', label: 'Favorites' },
] as const

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" aria-hidden />
            </span>
            <span className="font-serif text-lg tracking-tight sm:text-xl">
              FuzhouneseDict
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  isActive(pathname, link.href)
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-full border-border px-4 sm:inline-flex"
            asChild
          >
            <Link href="/signin">Sign In</Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive(pathname, link.href)
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-md border border-border px-3 py-2.5 text-center text-sm font-medium text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
