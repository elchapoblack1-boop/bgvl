import Navbar from '@/components/Navbar'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ProductsSection from '@/components/ProductsSection'
import CertificationsSection from '@/components/CertificationsSection'
import ContactSection from '@/components/ContactSection'
import StatsSection from '@/components/StatsSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ProductsSection />
        <CertificationsSection />
        <OrderForm />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
