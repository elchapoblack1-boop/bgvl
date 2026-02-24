import Navbar from '@/components/Navbar'
import { AboutSection } from '@/components/Sections'
import { Footer } from '@/components/Sections'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <AboutSection />
        <Footer />
      </div>
    </>
  )
}
