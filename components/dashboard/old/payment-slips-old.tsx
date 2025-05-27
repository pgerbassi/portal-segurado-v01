"use client"

import { useState } from "react"
import { Download, FileText, Search, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PaymentSlip, Car } from "@/types"

interface PaymentSlipsProps {
  paymentSlips: PaymentSlip[]
  cars: Car[]
  selectedCar: string
  onSelectCar: (carId: string) => void
}

export function PaymentSlips({ paymentSlips, cars, selectedCar, onSelectCar }: PaymentSlipsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  // Get selected car info
  const selectedCarInfo = selectedCar === "all" ? null : cars.find((car) => car.id === selectedCar)

  // Filter payment slips based on selected car and search
  const filteredSlips = paymentSlips.filter((slip) => {
    const matchesSearch =
      slip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCar = selectedCar === "all" || slip.carId === selectedCar

    return matchesSearch && matchesCar
  })

  return (
    <Card className="rounded-xl border-0 shadow-md">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-[#010059]">
                Boletos para Pagamento
                {selectedCarInfo && (
                  <span className="text-base font-normal text-gray-600 ml-2">
                    - {selectedCarInfo.make} {selectedCarInfo.model} ({selectedCarInfo.licensePlate})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {selectedCar === "all"
                  ? `Visualize e baixe comprovantes de todos os ${cars.length} veículos`
                  : `Comprovantes do veículo selecionado`}
              </CardDescription>
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar por número, período ou placa..."
                className="pl-8 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {selectedCar !== "all" && selectedCarInfo && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[#010059]/5 text-[#010059]">
                {selectedCarInfo.licensePlate}
              </Badge>
              <Badge variant="outline" className="bg-[#f58634]/5 text-[#f58634]">
                {selectedCarInfo.premium}/mês
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectCar("all")}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Ver todos
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="downloaded">Baixados</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <div className="space-y-4">
              {filteredSlips.length > 0 ? (
                filteredSlips.map((slip) => (
                  <div
                    key={slip.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedSlip === slip.id
                        ? "border-[#010059] bg-[#010059]/5"
                        : "border-gray-200 bg-white hover:border-[#010059]/50"
                    }`}
                    onClick={() => setSelectedSlip(slip.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <FileText className="h-4 w-4 text-[#010059]" />
                          <span className="font-medium">{slip.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {slip.period}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {slip.licensePlate}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">Emitido: {slip.date}</div>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                        <span className="font-medium">{slip.amount}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" className="bg-[#f58634] hover:bg-[#f58634]/90 rounded-lg">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Baixar comprovante</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum comprovante encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCar === "all"
                      ? "Tente ajustar seus termos de busca."
                      : "Este veículo não possui comprovantes ou tente ajustar a busca."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="m-0">
            <div className="space-y-4">
              {filteredSlips.slice(0, 3).map((slip) => (
                <div
                  key={slip.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedSlip === slip.id
                      ? "border-[#010059] bg-[#010059]/5"
                      : "border-gray-200 bg-white hover:border-[#010059]/50"
                  }`}
                  onClick={() => setSelectedSlip(slip.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <FileText className="h-4 w-4 text-[#010059]" />
                        <span className="font-medium">{slip.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {slip.period}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          {slip.licensePlate}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">Emitido: {slip.date}</div>
                    </div>
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      <span className="font-medium">{slip.amount}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" className="bg-[#f58634] hover:bg-[#f58634]/90 rounded-lg">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Baixar comprovante</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="downloaded" className="m-0">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum comprovante baixado</h3>
              <p className="mt-1 text-sm text-gray-500">Seus comprovantes baixados aparecerão aqui.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <HelpCircle className="h-4 w-4 mr-2 text-[#f58634]" />
          <span>Precisa de ajuda para encontrar um comprovante específico? Entre em contato com nosso suporte.</span>
        </div>
      </CardFooter>
    </Card>
  )
}
