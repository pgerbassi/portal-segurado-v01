"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PaymentSlip } from "@/types"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  MoreVertical,
  Share2
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { PIXPaymentModal } from "./pix-payment-modal"

interface PaymentSlipCardProps {
  slip: PaymentSlip
  isSelected: boolean
  onSelect: (slipId: string) => void
  isDownloading: boolean
  onDownload: (slipId: string) => void
}

export function PaymentSlipCard({ slip, isSelected, onSelect, isDownloading, onDownload }: PaymentSlipCardProps) {
  const [pixDialogOpen, setPixDialogOpen] = useState(false)

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload(slip.id)
  }

  const handlePixClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPixDialogOpen(true)
  }

  // Get status configuration
  const getStatusConfig = (status: PaymentSlip["status"]) => {
    switch (status) {
      case "Pago":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "Pendente":
        return {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        }
      case "Vencido":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: AlertTriangle,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: FileText,
          iconColor: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  const statusConfig = getStatusConfig(slip.status)
  const StatusIcon = statusConfig.icon

  // Check if slip is recent (within last 7 days for visual indicator)
  const isRecent = slip.updatedAt
    ? (() => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const updatedDate = new Date(slip.updatedAt.split("/").reverse().join("-"))
        return updatedDate >= sevenDaysAgo
      })()
    : false

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer relative active:scale-[0.98] touch-manipulation ${
        isSelected
          ? "border-[#010059] bg-[#010059]/5 shadow-xl"
          : "border-gray-200 bg-white hover:border-[#010059]/30 hover:shadow-lg"
      }`}
      onClick={() => onSelect(slip.id)}
    >
      {/* Recent indicator */}
      {isRecent && (
        <div className="absolute -top-3 right-1">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[0.5rem] border-blue-200 px-3 py-1 font-medium">
            Recente
          </Badge>
        </div>
      )}

      <div className="space-y-5">
        {/* Header Section - Mobile optimized */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`p-3 rounded-2xl ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}>
              <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-bold text-lg text-gray-900 truncate">{slip.id}</span>
                <Badge variant="outline" className="text-xs px-3 py-1 flex-shrink-0 font-medium">
                  {slip.period}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 font-medium">Emitido: {slip.date}</div>
            </div>
          </div>

          {/* Amount - Mobile optimized */}
          <div className="text-right flex-shrink-0 ml-4">
            <div className="font-bold text-2xl text-[#010059]">{slip.amount}</div>
          </div>
        </div>

        {/* Status and Due Date Section */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className={`flex items-center gap-2 px-4 py-2 ${statusConfig.color} border-2 font-medium`}
          >
            <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
            <span>{slip.status}</span>
          </Badge>
          {slip.dueDate && (
            <Badge variant="outline" className="text-sm px-3 py-2 bg-gray-50 text-gray-600 border-gray-200 font-medium">
              Vence: {slip.dueDate}
            </Badge>
          )}
        </div>

        {/* Action Buttons Section - Mobile optimized */}
        <div className="pt-4 border-t-2 border-gray-100">
          {/* Mobile: Stack buttons vertically for better touch targets */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            {/* Primary Action Button */}
            <Button
              size="lg"
              className="flex-1 h-14 bg-[#f58634] hover:bg-[#f58634]/90 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                  Baixando...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-3" />
                  Baixar PDF
                </>
              )}
            </Button>

            {/* Secondary Action - PIX Payment or Status */}
            {slip.status === "Pendente" || slip.status === "Vencido" ? (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-14 border-2 border-[#010059] text-[#010059] hover:bg-[#010059]/5 rounded-2xl text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                onClick={handlePixClick}
              >
                {/*<CreditCard className="h-5 w-5 mr-3" />*/}
                <Image
                  src="logo-pix.png"
                  alt="Credit Card Icon"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Pagar com PIX
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-14 border-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 rounded-2xl text-base font-semibold cursor-default"
                disabled
              >
                <CheckCircle className="h-5 w-5 mr-3" />
                Pago
              </Button>
            )}
          </div>

          {/* Mobile: Additional actions in dropdown */}
          <div className="flex justify-center mt-4 sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 rounded-2xl border-2 shadow-xl">
                <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="rounded-xl p-3">
                  <FileText className="h-4 w-4 mr-3" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="rounded-xl p-3">
                  <Share2 className="h-4 w-4 mr-3" />
                  Compartilhar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <PIXPaymentModal slip={slip} open={pixDialogOpen} onOpenChange={setPixDialogOpen} />
    </div>
  )
}
