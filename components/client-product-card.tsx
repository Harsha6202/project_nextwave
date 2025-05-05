"use client"

import dynamic from 'next/dynamic'
import ProductCard from './product-card'

const ClientProductCard = dynamic(() => Promise.resolve(ProductCard), {
  ssr: false
})

export default ClientProductCard