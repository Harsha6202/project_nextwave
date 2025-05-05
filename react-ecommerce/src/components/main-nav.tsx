"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/hooks/use-language"
import { useCurrency } from "@/hooks/use-currency"
import AuthModal from "./auth-modal"
import Cart from "./cart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faMagnifyingGlass, 
  faChevronDown, 
  faBagShopping, 
  faUser 
} from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useRef, useEffect } from "react"

export default function MainNav({ className }: { className?: string }) {
  const { user, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<"login" | "register">("login")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t, setLanguage, availableLanguages } = useLanguage()
  const { currency, setCurrency, availableCurrencies } = useCurrency()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="header">
        <div className="logo">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </Link>
        </div>

        <div className="header-icons">
          <div className="relative" ref={searchRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="header-icon"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
            
            {showSearch && (
              <form onSubmit={handleSearch} className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md p-2 z-50 flex gap-2 min-w-[300px]">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                  autoFocus
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>
            )}
          </div>

          <Button variant="ghost" size="icon" className="header-icon" asChild>
            <Link href="/wishlist">
              <FontAwesomeIcon icon={faHeart} />
            </Link>
          </Button>

          <Cart />

          {user ? (
            <div className="relative group">
              <Button variant="ghost" size="icon" className="header-icon">
                <FontAwesomeIcon icon={faUser} />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-sm font-medium">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/account" className="block px-2 py-1 text-sm hover:bg-gray-100 rounded">
                    Account Settings
                  </Link>
                  <Button variant="ghost" className="w-full text-left px-2 py-1 text-sm" onClick={() => logout()}>
                    {t("logout")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="header-icon" onClick={() => setAuthModalOpen(true)}>
              <FontAwesomeIcon icon={faUser} />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="language-selector">
                <span>ENG</span>
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableLanguages.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="currency-selector">
                <span>{currency}</span>
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableCurrencies.map((curr) => (
                <DropdownMenuItem key={curr} onClick={() => setCurrency(curr)}>
                  {curr}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="main-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/shop">Shop</Link>
          </li>
          <li className="nav-item">
            <Link href="/skills">Skills</Link>
          </li>
          <li className="nav-item">
            <Link href="/stories">Stories</Link>
          </li>
          <li className="nav-item">
            <Link href="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link href="/contact-us">Contact Us</Link>
          </li>
        </ul>
      </nav>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </header>
  )
}