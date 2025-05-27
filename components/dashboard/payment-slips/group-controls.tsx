"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown, ChevronUp, Globe, Layers, User } from "lucide-react"

interface GroupControlsProps {
  groupCount: number
  onExpandAll: () => void
  onCollapseAll: () => void
  expandedCount: number
  globallyControlledCount: number
  individuallyControlledCount: number
}

export function GroupControls({
  groupCount,
  onExpandAll,
  onCollapseAll,
  expandedCount,
  globallyControlledCount,
  individuallyControlledCount,
}: GroupControlsProps) {
  const allExpanded = expandedCount === groupCount
  const allCollapsed = expandedCount === 0

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-100 shadow-sm">
      {/* Mobile-First Header with statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#010059]/10 p-3 rounded-2xl">
            <Layers className="h-6 w-6 text-[#010059]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#010059] mb-1">{groupCount} veículos com boletos</h3>
            <p className="text-sm text-gray-600">Gerencie a visualização dos grupos</p>
          </div>
        </div>

        {expandedCount > 0 && (
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-2 text-sm font-medium"
            >
              <Calendar className="h-3 w-3 mr-1" />
              {expandedCount} expandidos
            </Badge>
          </div>
        )}
      </div>

      {/* Control statistics - Mobile optimized */}
      {(globallyControlledCount > 0 || individuallyControlledCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {globallyControlledCount > 0 && (
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{globallyControlledCount} sob controle global</span>
            </div>
          )}
          {individuallyControlledCount > 0 && (
            <div className="flex items-center space-x-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{individuallyControlledCount} sob controle individual</span>
            </div>
          )}
        </div>
      )}

      {/* Mobile-First Global control buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button
          variant="default"
          size="lg"
          onClick={onExpandAll}
          disabled={allExpanded}
          className="flex-1 h-14 bg-[#010059] hover:bg-[#010059]/90 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ChevronDown className="h-5 w-5 mr-3" />
          <Globe className="h-5 w-5 mr-3" />
          Expandir Todos
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={onCollapseAll}
          disabled={allCollapsed}
          className="flex-1 h-14 bg-[#010059] hover:bg-[#010059]/90 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ChevronUp className="h-5 w-5 mr-3" />
          <Globe className="h-5 w-5 mr-3" />
          Recolher Todos
        </Button>
      </div>

      {/* Mobile-optimized help text */}
      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border-l-4 border-blue-300">
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-blue-900">Controles Globais:</span> Aplicam a todos os grupos
              uniformemente
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-900">Controles Individuais:</span> Toque no cabeçalho de qualquer
              grupo para controle específico
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
