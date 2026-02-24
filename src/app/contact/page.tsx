import Navbar from '@/components/Navbar'
import { ContactSection } from '@/components/Sections'
import { Footer } from '@/components/Sections'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <ContactSection />
        <Footer />
      </div>
    </>
  )
}
