import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import { StatsSection, Footer } from '@/components/Sections'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <Footer />
    </>
  )
}
