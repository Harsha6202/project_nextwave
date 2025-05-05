'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  format: (amount: number) => string
  availableCurrencies: Currency[]
}

const availableCurrencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR']

const currencyFormats = {
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
  INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency
    if (savedCurrency && availableCurrencies.includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const format = (amount: number) => {
    return currencyFormats[currency].format(amount)
  }

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: handleSetCurrency, 
      format,
      availableCurrencies 
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}