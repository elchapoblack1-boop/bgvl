import Navbar from '@/components/Navbar'
import { CertificationsSection } from '@/components/Sections'
import { Footer } from '@/components/Sections'

export default function CertificationsPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <CertificationsSection />
        <Footer />
      </div>
    </>
  )
}
