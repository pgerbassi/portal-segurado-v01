"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaymentSlipPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function PaymentSlipPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaymentSlipPaginationProps) {
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers for mobile-friendly pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 3

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3)
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-6 border-t-2 border-gray-100">
      {/* Mobile-First pagination info */}
      <div className="text-center">
        <div className="text-base font-semibold text-gray-900 mb-1">
          Página <span className="text-[#010059]">{currentPage}</span> de{" "}
          <span className="text-[#010059]">{totalPages}</span>
        </div>
        <div className="text-sm text-gray-600">{totalItems} boletos no total</div>
      </div>

      {/* Mobile-optimized navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="h-12 px-4 rounded-2xl border-2 text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Ant</span>
        </Button>

        {/* Page Numbers - Hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPageChange(pageNum)
              }}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === pageNum
                  ? "bg-[#010059] text-white shadow-md"
                  : "border-2 hover:border-[#010059]/30 hover:bg-[#010059]/5"
              }`}
            >
              {pageNum}
            </Button>
          ))}

          {/* Show ellipsis if there are more pages */}
          {totalPages > 3 && currentPage < totalPages - 1 && (
            <div className="flex items-center justify-center h-10 w-10">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="h-12 px-4 rounded-2xl border-2 text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <span className="hidden sm:inline">Próxima</span>
          <span className="sm:hidden">Prox</span>
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Mobile: Current page indicator */}
      <div className="flex sm:hidden items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <div
            key={pageNum}
            className={`h-2 w-2 rounded-full transition-all duration-200 ${
              currentPage === pageNum ? "bg-[#010059] w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
