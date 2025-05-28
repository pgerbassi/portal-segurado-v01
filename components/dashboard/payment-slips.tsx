"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { usePaymentSlips } from "@/hooks/use-payment-slips"
import type { CarType, PaymentSlip, TabType } from "@/types"
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  HelpCircle,
  Search,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { CarGroup } from "./payment-slips/car-group"
import { PaymentSlipCard } from "./payment-slips/payment-slip-card"
import { PaymentSlipFilters } from "./payment-slips/payment-slip-filters"
import { PaymentSlipPagination } from "./payment-slips/payment-slip-pagination"

interface PaymentSlipsProps {
  paymentSlips: PaymentSlip[]
  cars: CarType[]
  selectedCar: string
  onSelectCar: (carId: string) => void
}

const SLIPS_PER_PAGE = 5

export function PaymentSlips({ paymentSlips, cars, selectedCar, onSelectCar }: PaymentSlipsProps) {
  const isMobile = useMobile()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const {
    filters,
    selectedSlip,
    downloadingSlips,
    sortBy,
    sortOrder,
    groupPages,
    isFilterOpen,
    globalAction,
    activeTab,
    filteredAndSortedSlips,
    groupedSlips,
    statistics,
    filterOptions,
    updateFilter,
    clearAllFilters,
    clearSpecificFilter,
    setSelectedSlip,
    setIsFilterOpen,
    setActiveTab,
    handleGroupStateChange,
    handleExpandAll,
    handleCollapseAll,
    changePage,
    handleDownload,
    handleSortChange,
  } = usePaymentSlips(paymentSlips, cars, selectedCar)

  // Reset collapse state when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsCollapsed(false)
    } else {
      setIsCollapsed(true)
    }
  }, [isMobile])

  // Get selected car info
  const selectedCarInfo = selectedCar === "all" ? null : cars.find((car) => car.id === selectedCar)

  // Get paginated slips for all slips view
  const getPaginatedSlips = (slips: PaymentSlip[]) => {
    const currentPage = groupPages["all"] || 1
    const startIndex = (currentPage - 1) * SLIPS_PER_PAGE
    const endIndex = startIndex + SLIPS_PER_PAGE
    return {
      slips: slips.slice(startIndex, endIndex),
      totalPages: Math.ceil(slips.length / SLIPS_PER_PAGE),
      currentPage,
    }
  }

  const renderAllSlips = () => {
    const { slips: paginatedSlips, totalPages, currentPage } = getPaginatedSlips(filteredAndSortedSlips)

    return (
      <div className="space-y-4">
        {paginatedSlips.map((slip) => (
          <PaymentSlipCard
            key={slip.id}
            slip={slip}
            isSelected={selectedSlip === slip.id}
            onSelect={setSelectedSlip}
            isDownloading={downloadingSlips.has(slip.id)}
            onDownload={handleDownload}
          />
        ))}

        {/* Pagination for all slips */}
        {totalPages > 1 && (
          <PaymentSlipPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedSlips.length}
            onPageChange={(page) => changePage("all", page)}
          />
        )}
      </div>
    )
  }

  const renderEmptyState = (tabType: TabType) => {
    const hasActiveFilters = statistics.activeFiltersCount > 0

    const getEmptyStateContent = () => {
      switch (tabType) {
        case "pending":
          return {
            title: hasActiveFilters ? "Nenhum boleto pendente encontrado" : "Nenhum boleto pendente",
            description: hasActiveFilters
              ? "Tente ajustar seus filtros para ver boletos pendentes."
              : "Não há boletos com status 'Pendente' no momento.",
            icon: Clock,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
          }
        case "paid":
          return {
            title: hasActiveFilters ? "Nenhum boleto pago encontrado" : "Nenhum boleto pago",
            description: hasActiveFilters
              ? "Tente ajustar seus filtros para ver boletos pagos."
              : "Não há boletos com status 'Pago' disponíveis.",
            icon: CheckCircle,
            color: "text-green-500",
            bgColor: "bg-green-50",
          }
        case "overdue":
          return {
            title: hasActiveFilters ? "Nenhum boleto vencido encontrado" : "Nenhum boleto vencido",
            description: hasActiveFilters
              ? "Tente ajustar seus filtros para ver boletos vencidos."
              : "Não há boletos com status 'Vencido' no momento.",
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-50",
          }
        default:
          return {
            title: hasActiveFilters ? "Nenhum resultado encontrado" : "Nenhum boleto encontrado",
            description: hasActiveFilters
              ? "Tente ajustar seus filtros ou limpar todos os filtros."
              : selectedCar === "all"
                ? "Não há boletos disponíveis no momento."
                : "Este veículo não possui boletos disponíveis.",
            icon: FileText,
            color: "text-gray-500",
            bgColor: "bg-gray-50",
          }
      }
    }

    const content = getEmptyStateContent()
    const EmptyIcon = content.icon

    return (
      <div className="text-center py-12 px-4">
        <div className={`${content.bgColor} rounded-3xl p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center`}>
          <EmptyIcon className={`h-12 w-12 ${content.color}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{content.title}</h3>
        <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
          {hasActiveFilters ? (
            <>
              {content.description}{" "}
              <button onClick={clearAllFilters} className="text-[#f58634] hover:underline font-semibold">
                Limpar filtros
              </button>
              .
            </>
          ) : (
            content.description
          )}
        </p>
        {hasActiveFilters && (
          <Button onClick={clearAllFilters} size="lg" className="h-12 px-6 rounded-2xl font-semibold">
            Limpar Filtros ({statistics.activeFiltersCount})
          </Button>
        )}
      </div>
    )
  }

  // Get tab-specific description
  const getTabDescription = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return "Boletos aguardando pagamento"
      case "paid":
        return "Boletos com pagamento processado"
      case "overdue":
        return "Boletos com prazo vencido"
      default:
        return selectedCar === "all"
          ? `Boletos de todos os ${cars.length} veículos`
          : `Comprovantes do veículo selecionado`
    }
  }

  // Get tab-specific info panel
  const getTabInfoPanel = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return (
          <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 mx-4 sm:mx-0">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-2xl flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-yellow-900 mb-2 text-base">Boletos Pendentes</h4>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Use o botão "Pagar com PIX" para efetuar o pagamento de forma rápida e segura
                </p>
              </div>
            </div>
          </div>
        )
      case "paid":
        return (
          <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200 mx-4 sm:mx-0">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-2xl flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-green-900 mb-2 text-base">Boletos Pagos</h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  Pagamentos processados com sucesso - Comprovantes disponíveis para download
                </p>
              </div>
            </div>
          </div>
        )
      case "overdue":
        return (
          <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200 mx-4 sm:mx-0">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-2xl flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-red-900 mb-2 text-base">Boletos Vencidos</h4>
                <p className="text-sm text-red-800 leading-relaxed">
                  Prazo vencido - Entre em contato com o suporte se necessário
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Mobile Collapsed Summary Component
  const MobileCollapsedSummary = () => (
    <div
      className="p-6 cursor-pointer touch-manipulation active:scale-[0.98] transition-transform duration-150"
      onClick={() => setIsCollapsed(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#010059]/10 p-3 rounded-2xl">
            <FileText className="h-6 w-6 text-[#010059]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#010059]">Gestão de Boletos</h2>
            <p className="text-sm text-gray-600">Toque para ver detalhes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-gray-400" />
          <ChevronDown className="h-6 w-6 text-[#010059]" />
        </div>
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
          <div className="text-2xl font-bold text-[#010059] mb-1">{statistics.allCount}</div>
          <div className="text-sm text-blue-700 font-medium">Total de Boletos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
          <div className="text-2xl font-bold text-green-700 mb-1">{statistics.paidCount}</div>
          <div className="text-sm text-green-700 font-medium">Pagos</div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statistics.pendingCount > 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-2 font-medium">
            <Clock className="h-3 w-3 mr-1" />
            {statistics.pendingCount} Pendentes
          </Badge>
        )}
        {statistics.overdueCount > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-2 font-medium">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {statistics.overdueCount} Vencidos
          </Badge>
        )}
        {statistics.activeFiltersCount > 0 && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 font-medium">
            <Filter className="h-3 w-3 mr-1" />
            {statistics.activeFiltersCount} Filtros
          </Badge>
        )}
      </div>

      {/* Selected Car Info */}
      {selectedCarInfo && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border">
          <span className="text-sm font-medium text-gray-700">
            {selectedCarInfo.make} {selectedCarInfo.model}
          </span>
          <Badge variant="outline" className="bg-[#010059]/10 text-[#010059] border-[#010059]/20 text-xs">
            {selectedCarInfo.licensePlate}
          </Badge>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-10 rounded-xl border-2"
          onClick={(e) => {
            e.stopPropagation()
            setIsFilterOpen(true)
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Button
          size="sm"
          className="flex-1 h-10 bg-[#f58634] hover:bg-[#f58634]/90 rounded-xl"
          onClick={(e) => {
            e.stopPropagation()
            setIsCollapsed(false)
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Ver Boletos
        </Button>
      </div>
    </div>
  )

  // Mobile Expanded Header Component
  const MobileExpandedHeader = () => (
    <CardHeader className="p-6 bg-white border-b">{/* bg-gradient-to-r from-gray-50 to-blue-50 border-b */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#010059]/10 p-3 rounded-2xl">
            <FileText className="h-6 w-6 text-[#010059]" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-[#010059]">Gestão de Boletos</CardTitle>
            <CardDescription className="text-sm text-gray-600">{getTabDescription(activeTab)}</CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="h-10 w-10 p-0 rounded-xl hover:bg-white/50"
        >
          <div className="flex flex-row items-center mr-2 space-x-2 gap-2">
            <EyeOff className="h-6 w-6 scale-[1.2] text-gray-500" />
            <ChevronUp className="h-6 w-6 scale-[1.4] text-[#010059]" />
          </div>
        </Button>
      </div>

      {/* Mobile Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar por número, período, placa..."
          className="pl-12 h-12 rounded-2xl border-2 text-base bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200 shadow-sm"
          value={filters.searchTerm}
          onChange={(e) => updateFilter("searchTerm", e.target.value)}
        />
        {filters.searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
            onClick={() => clearSpecificFilter("searchTerm")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter and Results Row */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="h-10 px-4 rounded-2xl border-2 relative bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="font-medium">Filtros</span>
          {statistics.activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs font-bold bg-[#f58634] text-white">
              {statistics.activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="text-right">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-base text-[#010059]">{statistics.filteredSlips}</span>
            <span className="mx-1">de</span>
            <span className="font-bold text-base text-[#010059]">{statistics.allCount}</span>
          </div>
        </div>
      </div>

      {/* Selected Car Info */}
      {selectedCar !== "all" && selectedCarInfo && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border mt-4">
          <Badge variant="outline" className="bg-[#010059]/10 text-[#010059] px-4 py-2 text-sm font-medium">
            {selectedCarInfo.licensePlate}
          </Badge>
          <Badge variant="outline" className="bg-[#f58634]/10 text-[#f58634] px-4 py-2 text-sm font-medium">
            {selectedCarInfo.premium}/mês
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCar("all")}
            className="ml-auto text-gray-500 hover:text-gray-700 h-8 px-3 rounded-xl font-medium"
          >
            <X className="h-3 w-3 mr-1" />
            Ver todos
          </Button>
        </div>
      )}
    </CardHeader>
  )

  return (
    <Card className="rounded-3xl border-0 shadow-xl bg-white overflow-hidden">
      {/* Mobile Collapsed View */}
      {isMobile && isCollapsed ? (
        <MobileCollapsedSummary />
      ) : (
        <>
          {/* Header - Mobile Expanded or Desktop */}
          {isMobile ? (
            <MobileExpandedHeader />
          ) : (
            <CardHeader className="p-6 sm:p-8 bg-gray-50">{/*bg-gradient-to-r from-gray-50 to-blue-50*/}
              <div className="space-y-6">
                {/* Desktop Header Section */}
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl sm:text-3xl text-[#010059] font-bold mb-2">
                    Gestão de Boletos
                  </CardTitle>
                  {selectedCarInfo && (
                    <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-2xl border">
                      <span className="text-base font-medium text-gray-700">
                        {selectedCarInfo.make} {selectedCarInfo.model}
                      </span>
                      <Badge variant="outline" className="bg-[#010059]/10 text-[#010059] border-[#010059]/20">
                        {selectedCarInfo.licensePlate}
                      </Badge>
                    </div>
                  )}
                  <CardDescription className="text-base mt-3 text-gray-600 leading-relaxed">
                    {getTabDescription(activeTab)}
                  </CardDescription>
                </div>

                {/* Desktop Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar por número, período, placa..."
                    className="pl-12 h-14 rounded-2xl border-2 text-base bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200 shadow-sm"
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter("searchTerm", e.target.value)}
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-xl hover:bg-gray-100"
                      onClick={() => clearSpecificFilter("searchTerm")}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Desktop Filter and Results Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    className="h-12 px-6 rounded-2xl border-2 relative bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
                  >
                    <Filter className="h-5 w-5 mr-3" />
                    <span className="font-medium">Filtros Avançados</span>
                    {statistics.activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-3 h-6 w-6 p-0 text-xs font-bold bg-[#f58634] text-white">
                        {statistics.activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  <div className="text-center sm:text-right">
                    <div className="text-sm text-gray-600">
                      <span className="font-bold text-lg text-[#010059]">{statistics.filteredSlips}</span>
                      <span className="mx-1">de</span>
                      <span className="font-bold text-lg text-[#010059]">{statistics.allCount}</span>
                      <span className="block sm:inline sm:ml-1">resultados encontrados</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Selected Car Info */}
                {selectedCar !== "all" && selectedCarInfo && (
                  <div className="flex flex-wrap items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border">
                    <Badge variant="outline" className="bg-[#010059]/10 text-[#010059] px-4 py-2 text-sm font-medium">
                      {selectedCarInfo.licensePlate}
                    </Badge>
                    <Badge variant="outline" className="bg-[#f58634]/10 text-[#f58634] px-4 py-2 text-sm font-medium">
                      {selectedCarInfo.premium}/mês
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectCar("all")}
                      className="ml-auto text-gray-500 hover:text-gray-700 h-10 px-4 rounded-xl font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Ver todos
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
          )}

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
              {/* Mobile-First Tab Design */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <TabsList className="grid w-full grid-cols-4 h-24 p-2 bg-gray-50 m-0 rounded-none">
                  <TabsTrigger
                    value="all"
                    className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <FileText className="h-5 w-5" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium hidden sm:block">Todos</span>
                      <span className="text-xs font-medium sm:hidden">Todos</span>
                      <span className="text-xs font-bold text-[#010059]">({statistics.allCount})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium hidden sm:block">Pendentes</span>
                      <span className="text-xs font-medium sm:hidden">Pendente</span>
                      <span className="text-xs font-bold text-yellow-600">({statistics.pendingCount})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="paid"
                    className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium hidden sm:block">Pagos</span>
                      <span className="text-xs font-medium sm:hidden">Pago</span>
                      <span className="text-xs font-bold text-green-600">({statistics.paidCount})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="overdue"
                    className="flex flex-col items-center gap-1 py-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium hidden sm:block">Vencidos</span>
                      <span className="text-xs font-medium sm:hidden">Vencido</span>
                      <span className="text-xs font-bold text-red-600">({statistics.overdueCount})</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6">
                {/* Status Summary - Mobile optimized */}
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-2 border-gray-100">{/* bg-gradient-to-r from-gray-50 to-blue-50 */}
                  <div className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Resumo dos boletos:
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center ">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 flex items-center gap-2 px-4 py-2 text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{statistics.paidCount} Pagos</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-2 px-4 py-2 text-sm font-medium"
                    >
                      <Clock className="h-4 w-4" />
                      <span>{statistics.pendingCount} Pendentes</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 flex items-center gap-2 px-4 py-2 text-sm font-medium"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>{statistics.overdueCount} Vencidos</span>
                    </Badge>
                  </div>
                </div>

                {/* Tab-specific info panels */}
                {getTabInfoPanel(activeTab) && <div className="mb-6">{getTabInfoPanel(activeTab)}</div>}

                {/* Tab Content */}
                <TabsContent value="all" className="m-0">
                  {filteredAndSortedSlips.length > 0 ? (
                    selectedCar === "all" ? (
                      <div className="space-y-6">
                        {/*<GroupControls
                          groupCount={Object.keys(groupedSlips).length}
                          expandedCount={statistics.expandedCount}
                          globallyControlledCount={statistics.globallyControlledCount}
                          individuallyControlledCount={statistics.individuallyControlledCount}
                          onExpandAll={handleExpandAll}
                          onCollapseAll={handleCollapseAll}
                        />*/}

                        <div className="space-y-4">
                          {Object.entries(groupedSlips).map(([carId, group]) => (
                            <CarGroup
                              key={carId}
                              carId={carId}
                              group={group}
                              selectedSlip={selectedSlip}
                              onSelectSlip={setSelectedSlip}
                              downloadingSlips={downloadingSlips}
                              onDownload={handleDownload}
                              currentPage={groupPages[carId] || 1}
                              onPageChange={changePage}
                              slipsPerPage={SLIPS_PER_PAGE}
                              globalAction={globalAction}
                              onStateChange={handleGroupStateChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      renderAllSlips()
                    )
                  ) : (
                    renderEmptyState("all")
                  )}
                </TabsContent>

                <TabsContent value="pending" className="m-0">
                  {filteredAndSortedSlips.length > 0 ? (
                    selectedCar === "all" ? (
                      <div className="space-y-6">
                        {/*<GroupControls
                          groupCount={Object.keys(groupedSlips).length}
                          expandedCount={statistics.expandedCount}
                          globallyControlledCount={statistics.globallyControlledCount}
                          individuallyControlledCount={statistics.individuallyControlledCount}
                          onExpandAll={handleExpandAll}
                          onCollapseAll={handleCollapseAll}
                        />*/}

                        <div className="space-y-4">
                          {Object.entries(groupedSlips).map(([carId, group]) => (
                            <CarGroup
                              key={carId}
                              carId={carId}
                              group={group}
                              selectedSlip={selectedSlip}
                              onSelectSlip={setSelectedSlip}
                              downloadingSlips={downloadingSlips}
                              onDownload={handleDownload}
                              currentPage={groupPages[carId] || 1}
                              onPageChange={changePage}
                              slipsPerPage={SLIPS_PER_PAGE}
                              globalAction={globalAction}
                              onStateChange={handleGroupStateChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      renderAllSlips()
                    )
                  ) : (
                    renderEmptyState("pending")
                  )}
                </TabsContent>

                <TabsContent value="paid" className="m-0">
                  {filteredAndSortedSlips.length > 0 ? (
                    selectedCar === "all" ? (
                      <div className="space-y-6">
                        {/*<GroupControls
                          groupCount={Object.keys(groupedSlips).length}
                          expandedCount={statistics.expandedCount}
                          globallyControlledCount={statistics.globallyControlledCount}
                          individuallyControlledCount={statistics.individuallyControlledCount}
                          onExpandAll={handleExpandAll}
                          onCollapseAll={handleCollapseAll}
                        />*/}

                        <div className="space-y-4">
                          {Object.entries(groupedSlips).map(([carId, group]) => (
                            <CarGroup
                              key={carId}
                              carId={carId}
                              group={group}
                              selectedSlip={selectedSlip}
                              onSelectSlip={setSelectedSlip}
                              downloadingSlips={downloadingSlips}
                              onDownload={handleDownload}
                              currentPage={groupPages[carId] || 1}
                              onPageChange={changePage}
                              slipsPerPage={SLIPS_PER_PAGE}
                              globalAction={globalAction}
                              onStateChange={handleGroupStateChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      renderAllSlips()
                    )
                  ) : (
                    renderEmptyState("paid")
                  )}
                </TabsContent>

                <TabsContent value="overdue" className="m-0">
                  {filteredAndSortedSlips.length > 0 ? (
                    selectedCar === "all" ? (
                      <div className="space-y-6">
                        {/*<GroupControls
                          groupCount={Object.keys(groupedSlips).length}
                          expandedCount={statistics.expandedCount}
                          globallyControlledCount={statistics.globallyControlledCount}
                          individuallyControlledCount={statistics.individuallyControlledCount}
                          onExpandAll={handleExpandAll}
                          onCollapseAll={handleCollapseAll}
                        />*/}

                        <div className="space-y-4">
                          {Object.entries(groupedSlips).map(([carId, group]) => (
                            <CarGroup
                              key={carId}
                              carId={carId}
                              group={group}
                              selectedSlip={selectedSlip}
                              onSelectSlip={setSelectedSlip}
                              downloadingSlips={downloadingSlips}
                              onDownload={handleDownload}
                              currentPage={groupPages[carId] || 1}
                              onPageChange={changePage}
                              slipsPerPage={SLIPS_PER_PAGE}
                              globalAction={globalAction}
                              onStateChange={handleGroupStateChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      renderAllSlips()
                    )
                  ) : (
                    renderEmptyState("overdue")
                  )}
                </TabsContent>
              </div>
            </Tabs>

            {/* Enhanced Filters Component */}
            <PaymentSlipFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearAllFilters={clearAllFilters}
              onClearSpecificFilter={clearSpecificFilter}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              isFilterOpen={isFilterOpen}
              onFilterOpenChange={setIsFilterOpen}
              filterOptions={filterOptions}
              activeFiltersCount={statistics.activeFiltersCount}
              totalResults={statistics.allCount}
              filteredResults={statistics.filteredSlips}
            />
          </CardContent>

          <CardFooter className="p-6 sm:p-8 border-t bg-gray-50">
            <div className="flex items-center justify-center text-center w-full">
              <div className="flex items-center gap-4">
                <div className="bg-[#f58634]/10 p-3 rounded-2xl">
                  <HelpCircle className="h-6 w-6 text-[#f58634]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 mb-1">Precisa de ajuda?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Entre em contato com nosso suporte para encontrar boletos específicos
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
