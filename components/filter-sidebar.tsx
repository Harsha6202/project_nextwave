import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

export const filterCategories = [
  {
    id: "ideal-for",
    title: "IDEAL FOR",
    options: ["Men", "Women", "Kids"],
  },
  {
    id: "occasion",
    title: "OCCASION",
    options: ["Work", "Casual", "Party", "Sports"],
  },
  {
    id: "fabric",
    title: "FABRIC",
    options: ["Cotton", "Polyester", "Silk", "Wool", "Denim"],
  },
  {
    id: "price",
    title: "PRICE",
    options: ["Under ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "Above ₹2000"],
  },
  {
    id: "segment",
    title: "SEGMENT",
    options: ["Premium", "Mid-range", "Budget"],
  },
  {
    id: "season",
    title: "SUITABLE FOR",
    options: ["Summer", "Winter", "All Seasons"],
  },
  {
    id: "material",
    title: "RAW MATERIALS",
    options: ["Natural", "Recycled", "Synthetic"],
  },
  {
    id: "pattern",
    title: "PATTERN",
    options: ["Solid", "Printed", "Striped", "Checkered"],
  },
]

interface FilterSidebarProps {
  onFilterChange: (filters: { [key: string]: string[] }) => void
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({})

  const handleFilterChange = (categoryId: string, option: string, checked: boolean) => {
    const newFilters = { ...selectedFilters }
    if (!newFilters[categoryId]) {
      newFilters[categoryId] = []
    }
    
    if (checked) {
      newFilters[categoryId] = [...newFilters[categoryId], option]
    } else {
      newFilters[categoryId] = newFilters[categoryId].filter(item => item !== option)
    }
    
    if (newFilters[categoryId].length === 0) {
      delete newFilters[categoryId]
    }
    
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <aside className="w-full">
      <Accordion type="multiple" className="space-y-2">
        {filterCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="text-sm font-medium">
              {category.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-2">
                {category.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category.id}-${option}`}
                      checked={selectedFilters[category.id]?.includes(option)}
                      onCheckedChange={(checked) => 
                        handleFilterChange(category.id, option, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`${category.id}-${option}`}
                      className="text-sm cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  )
}