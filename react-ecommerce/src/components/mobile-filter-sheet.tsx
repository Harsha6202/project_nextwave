import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp, faFilter } from "@fortawesome/free-solid-svg-icons"

interface FilterCategory {
  title: string
  options: string[]
  expanded?: boolean
}

const filterCategories: FilterCategory[] = [
  {
    title: "CUSTOMIZABLE",
    options: ["Yes"],
    expanded: true
  },
  {
    title: "IDEAL FOR",
    options: ["Men", "Women", "Kids"],
  },
  {
    title: "OCCASION",
    options: ["Casual", "Formal", "Party", "Sports"],
  },
  {
    title: "WORK",
    options: ["Handcrafted", "Machine Made", "Fair Trade"],
  },
  {
    title: "FABRIC",
    options: ["Cotton", "Leather", "Silk", "Wool", "Synthetic"],
  },
  {
    title: "SEGMENT",
    options: ["Fashion", "Lifestyle", "Home", "Accessories"],
  },
  {
    title: "SUITABLE FOR",
    options: ["Summer", "Winter", "All Seasons"],
  },
  {
    title: "RAW MATERIALS",
    options: ["Natural", "Recycled", "Synthetic"],
  },
  {
    title: "PATTERN",
    options: ["Solid", "Printed", "Striped", "Checkered"],
  },
]

export default function MobileFilterSheet() {
  const [categories, setCategories] = useState(filterCategories)
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({})
  const [open, setOpen] = useState(false)

  const toggleCategory = (index: number) => {
    setCategories(categories.map((cat, i) => 
      i === index ? { ...cat, expanded: !cat.expanded } : cat
    ))
  }

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || []
      return {
        ...prev,
        [category]: current.includes(option)
          ? current.filter(item => item !== option)
          : [...current, option]
      }
    })
  }

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <FontAwesomeIcon icon={faFilter} className="mr-2 h-4 w-4" />
          Filters {getSelectedCount() > 0 && `(${getSelectedCount()})`}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {categories.map((category, index) => (
            <div key={category.title} className="filter-category">
              <div 
                className="filter-title"
                onClick={() => toggleCategory(index)}
              >
                <span>{category.title}</span>
                <FontAwesomeIcon 
                  icon={category.expanded ? faChevronUp : faChevronDown} 
                  className="h-4 w-4"
                />
              </div>
              
              {category.expanded && (
                <div className="filter-options space-y-2 mt-3">
                  {category.options.map((option) => (
                    <div key={option} className="filter-option">
                      <label className="checkbox-label">
                        <Checkbox
                          checked={
                            (selectedFilters[category.title] || []).includes(option)
                          }
                          onCheckedChange={() => 
                            toggleFilter(category.title, option)
                          }
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex justify-between gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setSelectedFilters({})}
            >
              Clear All
            </Button>
            <Button 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}