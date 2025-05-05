"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import Cart from "./cart"

interface AccountPageProps {
  user: any
}

export default function AccountPage({ user }: AccountPageProps) {
  const [name, setName] = useState(user.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const { logout } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // This is a placeholder for updating user profile
    // In a real app, you would implement this functionality
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            LOGO
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm hover:text-gray-600">
              HOME
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600 font-medium">
              SHOP
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              ABOUT
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              SERVICES
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              CONTACT US
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Cart />
            <div className="relative group">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-sm font-medium">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/orders" className="block px-2 py-1 text-sm hover:bg-gray-100 rounded">
                    My Orders
                  </Link>
                  <Link href="/account" className="block px-2 py-1 text-sm bg-gray-100 rounded">
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to shop
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Profile Information</h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-gray-50" />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mt-6">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Password</h2>
              </div>
              <div className="p-4">
                <p className="text-sm mb-4">To change your password, please use the button below.</p>
                <Button variant="outline">Change Password</Button>
              </div>
            </div>
          </div>

          <div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Account Actions</h2>
              </div>
              <div className="p-4 space-y-4">
                <Link href="/orders" className="block">
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Sign Out
                </Button>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
