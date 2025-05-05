"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "./product-card"
import FilterSidebar from "./filter-sidebar"
import MobileFilterSheet from "./mobile-filter-sheet"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useSearchParams } from "next/navigation"

interface ProductListingProps {
  initialProducts: Array<{
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating?: {
      rate: number
      count: number
    }
    status?: "NEW PRODUCT" | "OUT OF STOCK"
  }>
  categories: string[]
  user?: any
}

export default function ProductListing({ initialProducts, categories, user }: ProductListingProps) {
  const [products, setProducts] = useState(initialProducts)
  const [filterVisible, setFilterVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("recommended")
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const itemsPerPage = 12
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy,
        search: searchQuery.trim(),
      })

      // Add filter parameters
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          if (key === 'price') {
            // Handle price range filters
            const priceRanges = values.map(range => {
              const [min, max] = range.match(/\d+/g) || []
              return { min, max }
            })
            const minPrice = Math.min(...priceRanges.map(r => Number(r.min)).filter(Boolean))
            const maxPrice = Math.max(...priceRanges.map(r => Number(r.max)).filter(Boolean))
            if (minPrice) params.append('minPrice', minPrice.toString())
            if (maxPrice) params.append('maxPrice', maxPrice.toString())
          } else {
            params.append(key, values.join(','))
          }
        }
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setProducts(data.products)
      setTotalPages(data.pagination.totalPages)
      setTotalProducts(data.pagination.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, sortBy, searchQuery, filters])

  const filteredProducts = products.filter(product => {
    // Filter by search query
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) {
      return false
    }

    // Filter by selected filters
    for (const categoryId in filters) {
      const selectedOptions = filters[categoryId]
      if (categoryId === "price") {
        // Handle price filter specially
        const price = product.price
        const priceMatch = selectedOptions.some(option => {
          switch(option) {
            case "Under ₹500":
              return price < 500
            case "₹500 - ₹1000":
              return price >= 500 && price <= 1000
            case "₹1000 - ₹2000":
              return price > 1000 && price <= 2000
            case "Above ₹2000":
              return price > 2000
            default:
              return false
          }
        })
        if (!priceMatch) {
          return false
        }
      } else if (categoryId === "ideal-for") {
        // Assuming product.category or other property indicates ideal for
        if (!selectedOptions.includes(product.category)) {
          return false
        }
      } else {
        // For other categories, check if product has matching property
        // This requires product to have properties matching filter categories
        // For now, skip or implement as needed
      }
    }

    return true
  })
  
  // Update total pages and products count based on filtered products
  useEffect(() => {
    const calculatedTotalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    setTotalPages(calculatedTotalPages)
    setTotalProducts(filteredProducts.length)
  }, [filteredProducts, itemsPerPage])

  const handleSort = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting
    fetchProducts() // Fetch products with new sorting criteria
  }

  const handleFilterChange = (newFilters: { [key: string]: string[] }) => {
    setFilters(newFilters)
    // TODO: Apply filtering logic to products based on newFilters
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Always visible on desktop */}
        <div className={`w-64 shrink-0 ${isMobile ? 'hidden' : 'block'}`}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1">
          {/* Sort Controls */}
          <div className="flex justify-end py-4">
            <select 
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border rounded-md py-2 px-3 bg-white"
              aria-label="Sort products"
            >
              <option value="recommended">RECOMMENDED</option>
              <option value="newest">NEWEST FIRST</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          {isMobile && (
            <button 
              onClick={() => setFilterVisible(!filterVisible)}
              className="w-full mb-4 px-4 py-2 border rounded-md flex items-center justify-center gap-2"
            >
              <span>{filterVisible ? "Hide Filters" : "Show Filters"}</span>
            </button>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
