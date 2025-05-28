"use client"

import { Car } from "@/components/icons/Car"
import { Badge } from "@/components/ui/badge"
import type { CarType, PaymentSlip } from "@/types"
import { AlertTriangle, CheckCircle, ChevronDown, Clock } from "lucide-react"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { PaymentSlipCard } from "./payment-slip-card"
import { PaymentSlipPagination } from "./payment-slip-pagination"


interface CarGroupData {
  car: CarType
  slips: PaymentSlip[]
  totalAmount: number
  pendingCount: number
  overdueCount: number
  paidCount: number
}

interface CarGroupProps {
  carId: string
  group: CarGroupData
  selectedSlip: string | null
  onSelectSlip: (slipId: string) => void
  downloadingSlips: Set<string>
  onDownload: (slipId: string) => void
  currentPage: number
  onPageChange: (carId: string, page: number) => void
  slipsPerPage: number
  globalAction?: { type: "expand" | "collapse"; timestamp: number } | null
  onStateChange?: (carId: string, isExpanded: boolean, isGloballyControlled: boolean) => void
}

export interface CarGroupRef {
  expand: () => void
  collapse: () => void
  toggle: () => void
  isExpanded: boolean
  forceExpand: () => void
  forceCollapse: () => void
}

export const CarGroup = forwardRef<CarGroupRef, CarGroupProps>(
  (
    {
      carId,
      group,
      selectedSlip,
      onSelectSlip,
      downloadingSlips,
      onDownload,
      currentPage,
      onPageChange,
      slipsPerPage,
      globalAction,
      onStateChange,
    },
    ref,
  ) => {
    // Individual state for this specific car group
    const [isExpanded, setIsExpanded] = useState(false)
    const [isGloballyControlled, setIsGloballyControlled] = useState(false)
    const [lastGlobalTimestamp, setLastGlobalTimestamp] = useState(0)

    // Handle global actions
    useEffect(() => {
      if (globalAction && globalAction.timestamp > lastGlobalTimestamp) {
        const newExpandedState = globalAction.type === "expand"
        setIsExpanded(newExpandedState)
        setIsGloballyControlled(true)
        setLastGlobalTimestamp(globalAction.timestamp)

        // Notify parent of state change
        if (onStateChange) {
          onStateChange(carId, newExpandedState, true)
        }
      }
    }, [globalAction, lastGlobalTimestamp, carId, onStateChange])

    // Memoized state update function
    const updateState = useCallback(
      (newState: boolean, isGlobalAction = false) => {
        setIsExpanded(newState)
        setIsGloballyControlled(isGlobalAction)

        // Notify parent of state change
        if (onStateChange) {
          onStateChange(carId, newState, isGlobalAction)
        }
      },
      [carId, onStateChange],
    )

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        expand: () => updateState(true, false),
        collapse: () => updateState(false, false),
        toggle: () => updateState(!isExpanded, false),
        forceExpand: () => updateState(true, true),
        forceCollapse: () => updateState(false, true),
        isExpanded,
      }),
      [updateState, isExpanded],
    )

    // Calculate pagination
    const startIndex = (currentPage - 1) * slipsPerPage
    const endIndex = startIndex + slipsPerPage
    const paginatedSlips = group.slips.slice(startIndex, endIndex)
    const totalPages = Math.ceil(group.slips.length / slipsPerPage)

    // Individual toggle handler
    const handleIndividualToggle = useCallback(() => {
      updateState(!isExpanded, false)
    }, [updateState, isExpanded])

    const handlePageChange = useCallback(
      (page: number) => {
        onPageChange(carId, page)
      },
      [carId, onPageChange],
    )

    // Get priority status for display
    const getPriorityStatus = () => {
      if (group.overdueCount > 0) return { status: "Vencido", count: group.overdueCount, color: "red" }
      if (group.pendingCount > 0) return { status: "Pendente", count: group.pendingCount, color: "yellow" }
      return { status: "Pago", count: group.paidCount, color: "green" }
    }

    const priorityStatus = getPriorityStatus()

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Clickable Header */}
        <div
          className={`p-4 transition-colors cursor-pointer select-none ${
            isGloballyControlled
              ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-400"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
          onClick={handleIndividualToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleIndividualToggle()
            }
          }}
          aria-expanded={isExpanded}
          aria-controls={`car-group-content-${carId}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="bg-[#f58634] text-white p-2 rounded-full flex-shrink-0">
                <Car className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-[#010059] text-sm sm:text-base">
                  {group.car.make} {group.car.model} {group.car.year}
                  {isGloballyControlled && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">(Controle Global)</span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{group.car.licensePlate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right">
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                    {group.slips.length} boletos
                  </Badge>

                  {/* Status-specific badges */}
                  {group.overdueCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 text-xs flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {group.overdueCount} vencidos
                    </Badge>
                  )}
                  {group.pendingCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {group.pendingCount} pendentes
                    </Badge>
                  )}
                  {group.paidCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {group.paidCount} pagos
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#010059] mt-1">
                  Total: R$ {group.totalAmount.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div
                className="flex-shrink-0 transition-transform duration-200"
                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <ChevronDown className={`h-5 w-5 ${isGloballyControlled ? "text-blue-500" : "text-gray-500"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div
          id={`car-group-content-${carId}`}
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white">
            {paginatedSlips.map((slip) => (
              <PaymentSlipCard
                key={slip.id}
                slip={slip}
                isSelected={selectedSlip === slip.id}
                onSelect={onSelectSlip}
                isDownloading={downloadingSlips.has(slip.id)}
                onDownload={onDownload}
              />
            ))}

            {/* Pagination for this group */}
            {totalPages > 1 && (
              <PaymentSlipPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={group.slips.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    )
  },
)

CarGroup.displayName = "CarGroup"
