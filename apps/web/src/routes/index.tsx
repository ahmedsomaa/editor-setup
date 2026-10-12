import { createFileRoute } from '@tanstack/react-router'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { FinalCta } from '@/components/landing/FinalCta'
import { Hero } from '@/components/landing/Hero'
import { PairMarquee } from '@/components/landing/PairMarquee'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main>
      <Hero />
      <PairMarquee />
      <FeatureGrid />
      <FinalCta />
    </main>
  )
}
