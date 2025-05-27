"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from "lucide-react"
import { useState } from "react"

interface HelpSupportProps {
  supportData: {
    phone: string
    email: string
    hours: string
  }
}

export function HelpSupport({ supportData }: HelpSupportProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="rounded-xl border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#010059] flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" /> Precisa de Ajuda?
          </CardTitle>
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
        <CardDescription>Entre em contato com nossa equipe de suporte</CardDescription>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Telefone:</span>
                <span className="font-medium">{supportData.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">E-mail:</span>
                <span className="font-medium">{supportData.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Horário:</span>
                <span className="font-medium">{supportData.hours}</span>
              </div>
            </div>

            <Button className="w-full bg-white border border-[#010059] text-[#010059] hover:bg-[#010059]/5 rounded-lg">
              <MessageSquare className="mr-2 h-4 w-4" /> Iniciar Chat com Suporte
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
