'use client'

import { DictionarySearchBox } from '@/components/dictionary-search-box'
import type { DictionaryEntry } from '@/types/dictionary'
import './home-title.css'

interface HomePageProps {
  entries: DictionaryEntry[]
}

export function HomePage({ entries }: HomePageProps) {
  return (
    <div>
      <main>
        <section
          className="relative w-full min-h-[70vh] sm:min-h-[78vh] lg:min-h-[85vh] bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/fuzhou-hero-2.jpg)',
            backgroundPosition: 'center 55%',
            backgroundSize: 'cover',
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/[0.08]" aria-hidden />

          <div className="relative z-10 flex min-h-[70vh] flex-col sm:min-h-[78vh] lg:min-h-[85vh]">
            <div className="px-4 pt-16 sm:pt-20 md:pt-24">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl md:text-6xl [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">
                  <span className="home-title-word">Fuzhounese</span>{' '}
                  <span className="home-title-word home-title-word--delay">
                    Dictionary
                  </span>
                </h1>

                <div className="relative z-20 mt-6 sm:mt-8">
                  <DictionarySearchBox entries={entries} size="hero" autoFocus />
                </div>
              </div>
            </div>

            <div className="min-h-[32vh] flex-1 sm:min-h-[38vh]" aria-hidden />
          </div>
        </section>

        <section className="border-t border-border bg-secondary px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                About Fuzhounese
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Fuzhounese (福州話) is a variety of Eastern Min spoken in and around Fuzhou,
                Fujian. It has its own sound system, tones, and vocabulary that set it apart from
                Mandarin. Placeholder copy for now — this section will later introduce the language,
                writing conventions, and who speaks it today.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
                Why This Dictionary Exists
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Many speakers grow up with Fuzhounese at home but have few tools for looking up
                words or teaching them to the next generation. This project aims to make everyday
                vocabulary easier to find, hear, and remember. Placeholder copy for now — more
                context on the community and preservation goals will go here.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Preserving the beautiful language of Fuzhou
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            福州話 • Eastern Min • 閩東語
          </p>
        </div>
      </footer>
    </div>
  )
}
