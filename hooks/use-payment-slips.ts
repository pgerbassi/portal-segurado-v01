"use client"

import { toast } from "@/hooks/use-toast"
import type { CarType, PaymentSlip, TabType } from "@/types"
import { useCallback, useMemo, useState } from "react"

interface GroupedSlips {
  [carId: string]: {
    car: CarType
    slips: PaymentSlip[]
    totalAmount: number
    pendingCount: number
    overdueCount: number
    paidCount: number
  }
}

interface GroupState {
  isExpanded: boolean
  isGloballyControlled: boolean
}

interface FilterCriteria {
  searchTerm: string
  make: string
  model: string
  year: string
  status: string
  licensePlate: string
  policyNumber: string
}

export function usePaymentSlips(paymentSlips: PaymentSlip[], cars: CarType[], selectedCar: string) {
  // Basic state
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)
  const [downloadingSlips, setDownloadingSlips] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"date" | "amount" | "period">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [groupPages, setGroupPages] = useState<{ [key: string]: number }>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("all")

  // Enhanced filter criteria
  const [filters, setFilters] = useState<FilterCriteria>({
    searchTerm: "",
    make: "all",
    model: "all",
    year: "all",
    status: "all",
    licensePlate: "",
    policyNumber: "",
  })

  // Global action state with timestamp to prevent infinite loops
  const [globalAction, setGlobalAction] = useState<{ type: "expand" | "collapse"; timestamp: number } | null>(null)
  const [groupStates, setGroupStates] = useState<{ [key: string]: GroupState }>({})

  // Get unique filter options from data
  const filterOptions = useMemo(() => {
    const makes = new Set<string>()
    const models = new Set<string>()
    const years = new Set<string>()
    const statuses = new Set<string>()

    // Collect data from cars and payment slips
    cars.forEach((car) => {
      makes.add(car.make)
      models.add(car.model)
      years.add(car.year)
    })

    paymentSlips.forEach((slip) => {
      statuses.add(slip.status)
    })

    return {
      makes: Array.from(makes).sort(),
      models: Array.from(models).sort(),
      years: Array.from(years).sort((a, b) => Number.parseInt(b) - Number.parseInt(a)), // Newest first
      statuses: Array.from(statuses).sort(),
    }
  }, [cars, paymentSlips])

  // Enhanced filter and sort payment slips with simplified tab-specific logic
  const filteredAndSortedSlips = useMemo(() => {
    const filtered = paymentSlips.filter((slip) => {
      // Get car data for this slip
      const car = cars.find((c) => c.id === slip.carId)
      if (!car) return false

      // Simplified tab-specific filtering based on status only
      switch (activeTab) {
        case "pending":
          if (slip.status !== "Pendente") return false
          break
        case "paid":
          if (slip.status !== "Pago") return false
          break
        case "overdue":
          if (slip.status !== "Vencido") return false
          break
        case "all":
        default:
          // No status filtering for "all" tab - show everything
          break
      }

      // Basic search term matching
      const searchMatch =
        filters.searchTerm === "" ||
        slip.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        slip.period.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        slip.licensePlate.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        car.make.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        car.policyNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())

      // Car selection filter
      const carMatch = selectedCar === "all" || slip.carId === selectedCar

      // Make filter
      const makeMatch = filters.make === "all" || car.make === filters.make

      // Model filter
      const modelMatch = filters.model === "all" || car.model === filters.model

      // Year filter
      const yearMatch = filters.year === "all" || car.year === filters.year

      // Status filter (only apply if not overridden by tab)
      const statusMatch = filters.status === "all" || slip.status === filters.status

      // License plate filter (partial match)
      const licensePlateMatch =
        filters.licensePlate === "" ||
        slip.licensePlate.toLowerCase().includes(filters.licensePlate.toLowerCase()) ||
        car.licensePlate.toLowerCase().includes(filters.licensePlate.toLowerCase())

      // Policy number filter (partial match)
      const policyNumberMatch =
        filters.policyNumber === "" || car.policyNumber.toLowerCase().includes(filters.policyNumber.toLowerCase())

      return (
        searchMatch &&
        carMatch &&
        makeMatch &&
        modelMatch &&
        yearMatch &&
        statusMatch &&
        licensePlateMatch &&
        policyNumberMatch
      )
    })

    // Sort slips
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.date.split("/").reverse().join("-")).getTime() -
            new Date(b.date.split("/").reverse().join("-")).getTime()
          break
        case "amount":
          comparison =
            Number.parseFloat(a.amount.replace(/[R$\s.]/g, "").replace(",", ".")) -
            Number.parseFloat(b.amount.replace(/[R$\s.]/g, "").replace(",", "."))
          break
        case "period":
          comparison = a.period.localeCompare(b.period)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [paymentSlips, cars, selectedCar, filters, sortBy, sortOrder, activeTab])

  // Group slips by car with enhanced statistics
  const groupedSlips: GroupedSlips = useMemo(() => {
    const groups: GroupedSlips = {}

    filteredAndSortedSlips.forEach((slip) => {
      const car = cars.find((c) => c.id === slip.carId)
      if (!car) return

      if (!groups[slip.carId]) {
        groups[slip.carId] = {
          car,
          slips: [],
          totalAmount: 0,
          pendingCount: 0,
          overdueCount: 0,
          paidCount: 0,
        }
      }

      groups[slip.carId].slips.push(slip)
      const amount = Number.parseFloat(slip.amount.replace(/[R$\s.]/g, "").replace(",", "."))
      groups[slip.carId].totalAmount += amount

      // Count by status
      switch (slip.status) {
        case "Pago":
          groups[slip.carId].paidCount++
          break
        case "Pendente":
          groups[slip.carId].pendingCount++
          break
        case "Vencido":
          groups[slip.carId].overdueCount++
          break
      }
    })

    return groups
  }, [filteredAndSortedSlips, cars])

  // Calculate comprehensive statistics for all slips (not just filtered)
  const statistics = useMemo(() => {
    const expandedCount = Object.values(groupStates).filter((state) => state.isExpanded).length
    const globallyControlledCount = Object.values(groupStates).filter((state) => state.isGloballyControlled).length
    const individuallyControlledCount = Object.values(groupStates).filter(
      (state) => !state.isGloballyControlled && state.isExpanded,
    ).length

    // Filter statistics
    const totalSlips = paymentSlips.length
    const filteredSlips = filteredAndSortedSlips.length
    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
      if (key === "searchTerm" || key === "licensePlate" || key === "policyNumber") {
        return value !== ""
      }
      return value !== "all"
    }).length

    // Status-based statistics for all slips (for tab counts)
    const allSlips = paymentSlips.filter((slip) => {
      const car = cars.find((c) => c.id === slip.carId)
      return car && (selectedCar === "all" || slip.carId === selectedCar)
    })

    const paidSlips = allSlips.filter((slip) => slip.status === "Pago")
    const pendingSlips = allSlips.filter((slip) => slip.status === "Pendente")
    const overdueSlips = allSlips.filter((slip) => slip.status === "Vencido")

    return {
      expandedCount,
      globallyControlledCount,
      individuallyControlledCount,
      totalSlips,
      filteredSlips,
      activeFiltersCount,
      // Tab-specific counts (for all slips matching car selection)
      allCount: allSlips.length,
      paidCount: paidSlips.length,
      pendingCount: pendingSlips.length,
      overdueCount: overdueSlips.length,
    }
  }, [groupStates, paymentSlips, filteredAndSortedSlips.length, filters, cars, selectedCar])

  // Filter update functions
  const updateFilter = useCallback((key: keyof FilterCriteria, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      make: "all",
      model: "all",
      year: "all",
      status: "all",
      licensePlate: "",
      policyNumber: "",
    })

    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    })
  }, [])

  const clearSpecificFilter = useCallback(
    (key: keyof FilterCriteria) => {
      const defaultValue = key === "searchTerm" || key === "licensePlate" || key === "policyNumber" ? "" : "all"
      updateFilter(key, defaultValue)
    },
    [updateFilter],
  )

  // Handle group state changes
  const handleGroupStateChange = useCallback((carId: string, isExpanded: boolean, isGloballyControlled: boolean) => {
    setGroupStates((prev) => ({
      ...prev,
      [carId]: {
        isExpanded,
        isGloballyControlled,
      },
    }))
  }, [])

  // Global expand all function
  const handleExpandAll = useCallback(() => {
    setGlobalAction({ type: "expand", timestamp: Date.now() })

    toast({
      title: "Todos os grupos expandidos",
      description:
        "Todos os grupos de veículos foram expandidos. Clique em qualquer cabeçalho para controle individual.",
    })
  }, [])

  // Global collapse all function
  const handleCollapseAll = useCallback(() => {
    setGlobalAction({ type: "collapse", timestamp: Date.now() })

    toast({
      title: "Todos os grupos recolhidos",
      description:
        "Todos os grupos de veículos foram recolhidos. Clique em qualquer cabeçalho para controle individual.",
    })
  }, [])

  // Change page for a group
  const changePage = useCallback((carId: string, page: number) => {
    setGroupPages((prev) => ({ ...prev, [carId]: page }))
  }, [])

  // Function to handle PDF download
  const handleDownload = useCallback(async (slipId: string) => {
    setDownloadingSlips((prev) => new Set(prev).add(slipId))

    try {
      const response = await fetch("https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK")

      if (!response.ok) {
        throw new Error("Falha ao baixar o arquivo")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `comprovante-${slipId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download concluído",
        description: `Comprovante ${slipId} foi baixado com sucesso.`,
      })
    } catch (error) {
      console.error("Erro no download:", error)
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o comprovante. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDownloadingSlips((prev) => {
        const newSet = new Set(prev)
        newSet.delete(slipId)
        return newSet
      })
    }
  }, [])

  const handleSortChange = useCallback((newSortBy: "date" | "amount" | "period", newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }, [])

  return {
    // State
    filters,
    selectedSlip,
    downloadingSlips,
    sortBy,
    sortOrder,
    groupPages,
    isFilterOpen,
    globalAction,
    groupStates,
    activeTab,

    // Computed data
    filteredAndSortedSlips,
    groupedSlips,
    statistics,
    filterOptions,

    // Actions
    updateFilter,
    clearAllFilters,
    clearSpecificFilter,
    setSelectedSlip,
    setSortBy,
    setSortOrder,
    setIsFilterOpen,
    setActiveTab,
    handleGroupStateChange,
    handleExpandAll,
    handleCollapseAll,
    changePage,
    handleDownload,
    handleSortChange,
  }
}
