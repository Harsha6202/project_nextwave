"use client"

import { useCurrency } from "'hooks/use-currency'"

export default function CurrencySelector() {
  const { currency, setCurrency, availableCurrencies } = useCurrency()

  return (
    <select
      aria-label="Select currency"
      value={currency}
      onChange={(e) => setCurrency(e.target.value as typeof currency)}
      className="border rounded-md py-1 px-2"
    >
      {availableCurrencies.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  )
}
