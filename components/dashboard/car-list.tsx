"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Car as CarType } from "@/types"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { useState } from "react"
import { Car } from "../icons/Car"

interface CarListProps {
  cars: CarType[]
  selectedCar: string
  onSelectCar: (carId: string) => void
}

export function CarList({ cars, selectedCar, onSelectCar }: CarListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAllCars, setShowAllCars] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [carSearchTerm, setCarSearchTerm] = useState("")
  const [makeFilter, setMakeFilter] = useState<string>("all")

  // Filtra carros - pesquisa ou filtros
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(carSearchTerm.toLowerCase())

    const matchesMake = makeFilter === "all" || car.make === makeFilter

    return matchesSearch && matchesMake
  })

  // Determina qual carro mostrar
  const displayedCars = showAllCars ? filteredCars : filteredCars.slice(0, 5)
  const hasMoreCars = filteredCars.length > 5

  // Filtros personalizados
  const uniqueMakes = Array.from(new Set(cars.map((car) => car.make)))

  return (
    <Card className="rounded-xl border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#010059] flex items-center">
            <Car className="mr-2 h-5 w-5" /> Meus Veículos
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtrar Veículos</SheetTitle>
                  <SheetDescription>Use os filtros abaixo para encontrar veículos específicos</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Buscar</label>
                    <Input
                      placeholder="Marca, modelo ou placa..."
                      value={carSearchTerm}
                      onChange={(e) => setCarSearchTerm(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Marca</label>
                    <Select value={makeFilter} onValueChange={setMakeFilter}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Selecione uma marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as marcas</SelectItem>
                        {uniqueMakes.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      setCarSearchTerm("")
                      setMakeFilter("all")
                    }}
                    variant="outline"
                    className="w-full rounded-lg"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-[#010059]"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
            >
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <CardDescription>
          {filteredCars.length === 1
            ? "Selecione o veículo para ver seus boletos"
            : `Selecione um dos ${filteredCars.length} veículos para ver seus boletos`}
        </CardDescription>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <div className="space-y-3">
            <Button
              variant={selectedCar === "all" ? "default" : "outline"}
              className={`w-full justify-start rounded-lg ${
                selectedCar === "all" ? "bg-[#010059] hover:bg-[#010059]/90" : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectCar("all")}
            >
              <Car className="mr-2 h-4 w-4" />
              Todos os Veículos ({filteredCars.length})
            </Button>

            {displayedCars.map((car) => (
              <div
                key={car.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedCar === car.id
                    ? "border-[#010059] bg-[#010059]/5"
                    : "border-gray-200 bg-white hover:border-[#010059]/50"
                }`}
                onClick={() => onSelectCar(car.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-[#f58634] text-white p-2 rounded-full">
                    <Car className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {car.make} {car.model} {car.year}
                    </p>
                    <p className="text-xs text-gray-500">{car.licensePlate}</p>
                    <p className="text-xs text-[#010059] font-medium">{car.premium}/mês</p>
                  </div>
                </div>
              </div>
            ))}

            {hasMoreCars && (
              <Button
                variant="outline"
                className="w-full mt-2 border-dashed border-gray-300 hover:border-[#010059] hover:bg-[#010059]/5"
                onClick={() => setShowAllCars(!showAllCars)}
              >
                {showAllCars ? (
                  <span className="flex items-center">
                    <ChevronUp className="mr-2 h-4 w-4" /> Mostrar menos
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ChevronDown className="mr-2 h-4 w-4" /> Mostrar mais {filteredCars.length - 5} veículos
                  </span>
                )}
              </Button>
            )}

            {filteredCars.length === 0 && (
              <div className="text-center py-4">
                <Car className="mx-auto h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500 mt-2">Nenhum veículo encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
