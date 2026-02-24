import Navbar from '@/components/Navbar'
import { ProductsSection } from '@/components/Sections'
import { Footer } from '@/components/Sections'

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <ProductsSection />
        <Footer />
      </div>
    </>
  )
}
