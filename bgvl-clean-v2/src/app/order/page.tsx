import Navbar from '@/components/Navbar'
import OrderForm from '@/components/OrderForm'
import { Footer } from '@/components/Sections'

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <OrderForm />
        <Footer />
      </div>
    </>
  )
}
