"use client"

import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "@/components/session-provider"
import { LanguageProvider } from "@/hooks/use-language"
import { CurrencyProvider } from "@/hooks/use-currency"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SessionProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster position="bottom-right" />
                </WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}