"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { RotateCcw, SlidersHorizontal, X } from "lucide-react"

interface FilterCriteria {
  searchTerm: string
  make: string
  model: string
  year: string
  status: string
  licensePlate: string
  policyNumber: string
}

interface FilterOptions {
  makes: string[]
  models: string[]
  years: string[]
  statuses: string[]
}

interface PaymentSlipFiltersProps {
  filters: FilterCriteria
  onFilterChange: (key: keyof FilterCriteria, value: string) => void
  onClearAllFilters: () => void
  onClearSpecificFilter: (key: keyof FilterCriteria) => void
  sortBy: "date" | "amount" | "period"
  sortOrder: "asc" | "desc"
  onSortChange: (sortBy: "date" | "amount" | "period", sortOrder: "asc" | "desc") => void
  isFilterOpen: boolean
  onFilterOpenChange: (open: boolean) => void
  filterOptions: FilterOptions
  activeFiltersCount: number
  totalResults: number
  filteredResults: number
}

export function PaymentSlipFilters({
  filters,
  onFilterChange,
  onClearAllFilters,
  onClearSpecificFilter,
  sortBy,
  sortOrder,
  onSortChange,
  isFilterOpen,
  onFilterOpenChange,
  filterOptions,
  activeFiltersCount,
  totalResults,
  filteredResults,
}: PaymentSlipFiltersProps) {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as ["date" | "amount" | "period", "asc" | "desc"]
    onSortChange(field, order)
  }

  const getActiveFilters = () => {
    const active: Array<{ key: keyof FilterCriteria; label: string; value: string }> = []

    if (filters.searchTerm) {
      active.push({ key: "searchTerm", label: "Busca", value: filters.searchTerm })
    }
    if (filters.make !== "all") {
      active.push({ key: "make", label: "Marca", value: filters.make })
    }
    if (filters.model !== "all") {
      active.push({ key: "model", label: "Modelo", value: filters.model })
    }
    if (filters.year !== "all") {
      active.push({ key: "year", label: "Ano", value: filters.year })
    }
    if (filters.status !== "all") {
      active.push({ key: "status", label: "Status", value: filters.status })
    }
    if (filters.licensePlate) {
      active.push({ key: "licensePlate", label: "Placa", value: filters.licensePlate })
    }
    if (filters.policyNumber) {
      active.push({ key: "policyNumber", label: "Apólice", value: filters.policyNumber })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  return (
    <>
      {/* Active filters display - Mobile optimized */}
      {activeFilters.length > 0 && (
        <div className="p-4 mx-4 sm:mx-6 mb-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-900">Filtros ativos:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-8 px-3 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-200 rounded-xl font-medium"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Limpar todos
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200"
                onClick={() => onClearSpecificFilter(filter.key)}
              >
                {filter.label}: {filter.value}
                <X className="h-3 w-3 ml-2" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Mobile filter sheet */}
      <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-3xl border-t-2">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-2xl font-bold text-[#010059] flex items-center gap-3">
              <div className="bg-[#010059]/10 p-2 rounded-2xl">
                <SlidersHorizontal className="h-6 w-6 text-[#010059]" />
              </div>
              Filtros Avançados
            </SheetTitle>
            <SheetDescription className="text-base leading-relaxed">
              Use os filtros abaixo para encontrar boletos específicos.{" "}
              <span className="font-semibold text-[#010059]">{filteredResults}</span> de{" "}
              <span className="font-semibold text-[#010059]">{totalResults}</span> resultados encontrados.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8 mt-6">
            {/* Vehicle Filters */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#f58634] rounded-full"></div>
                Filtros do Veículo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="make-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Marca
                  </Label>
                  <Select value={filters.make} onValueChange={(value) => onFilterChange("make", value)}>
                    <SelectTrigger id="make-filter" className="h-12 rounded-2xl border-2 text-base">
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                      <SelectItem value="all" className="rounded-xl p-3 pl-8">
                        Todas as marcas
                      </SelectItem>
                      {filterOptions.makes.map((make) => (
                        <SelectItem key={make} value={make} className="rounded-xl p-3 pl-8">
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Modelo
                  </Label>
                  <Select value={filters.model} onValueChange={(value) => onFilterChange("model", value)}>
                    <SelectTrigger id="model-filter" className="h-12 rounded-2xl border-2 text-base">
                      <SelectValue placeholder="Todos os modelos" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                      <SelectItem value="all" className="rounded-xl p-3 pl-8">
                        Todos os modelos
                      </SelectItem>
                      {filterOptions.models.map((model) => (
                        <SelectItem key={model} value={model} className="rounded-xl p-3 pl-8">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Ano
                  </Label>
                  <Select value={filters.year} onValueChange={(value) => onFilterChange("year", value)}>
                    <SelectTrigger id="year-filter" className="h-12 rounded-2xl border-2 text-base">
                      <SelectValue placeholder="Todos os anos" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                      <SelectItem value="all" className="rounded-xl p-3 pl-8">
                        Todos os anos
                      </SelectItem>
                      {filterOptions.years.map((year) => (
                        <SelectItem key={year} value={year} className="rounded-xl p-3 pl-8">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Status
                  </Label>
                  <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
                    <SelectTrigger id="status-filter" className="h-12 rounded-2xl border-2 text-base">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2">
                      <SelectItem value="all" className="rounded-xl p-3 pl-8">
                        Todos os status
                      </SelectItem>
                      {filterOptions.statuses.map((status) => (
                        <SelectItem key={status} value={status} className="rounded-xl p-3 pl-8">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Text Filters */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#f58634] rounded-full"></div>
                Busca Específica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="license-plate-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Placa do Veículo
                  </Label>
                  <div className="relative">
                    <Input
                      id="license-plate-filter"
                      placeholder="Ex: ABC-1234"
                      value={filters.licensePlate}
                      onChange={(e) => onFilterChange("licensePlate", e.target.value)}
                      className="h-12 rounded-2xl border-2 text-base pr-12"
                    />
                    {filters.licensePlate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-xl"
                        onClick={() => onClearSpecificFilter("licensePlate")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="policy-number-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                    Número da Apólice
                  </Label>
                  <div className="relative">
                    <Input
                      id="policy-number-filter"
                      placeholder="Ex: APL-12345"
                      value={filters.policyNumber}
                      onChange={(e) => onFilterChange("policyNumber", e.target.value)}
                      className="h-12 rounded-2xl border-2 text-base pr-12"
                    />
                    {filters.policyNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-xl"
                        onClick={() => onClearSpecificFilter("policyNumber")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Sort Options */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#f58634] rounded-full"></div>
                Ordenação
              </h3>
              <div>
                <Label htmlFor="sort-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                  Ordenar por
                </Label>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                  <SelectTrigger id="sort-filter" className="h-12 rounded-2xl border-2 text-base">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2">
                    <SelectItem value="date-desc" className="rounded-xl p-3 pl-8">
                      Data (mais recente)
                    </SelectItem>
                    <SelectItem value="date-asc" className="rounded-xl p-3 pl-8">
                      Data (mais antigo)
                    </SelectItem>
                    <SelectItem value="amount-desc" className="rounded-xl p-3 pl-8">
                      Valor (maior)
                    </SelectItem>
                    <SelectItem value="amount-asc" className="rounded-xl p-3 pl-8">
                      Valor (menor)
                    </SelectItem>
                    <SelectItem value="period-desc" className="rounded-xl p-3 pl-8">
                      Período (Z-A)
                    </SelectItem>
                    <SelectItem value="period-asc" className="rounded-xl p-3 pl-8">
                      Período (A-Z)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear All Button */}
            {activeFiltersCount > 0 && (
              <>
                <Separator className="my-8" />
                <Button
                  onClick={onClearAllFilters}
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-2 text-base font-semibold"
                >
                  <RotateCcw className="h-5 w-5 mr-3" />
                  Limpar Todos os Filtros ({activeFiltersCount})
                </Button>
              </>
            )}

            {/* Bottom padding for mobile */}
            <div className="h-8"></div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
