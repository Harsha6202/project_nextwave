import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientProviders from "@/components/client-providers"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextWave - Modern E-commerce",
  description: "NextWave is a modern e-commerce platform built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClientProviders>
            <Header />
            <main className="flex-grow [&>*]:flex-grow">
              {children}
            </main>
            <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
