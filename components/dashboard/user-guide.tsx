"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Download, Info } from "lucide-react"
import { useState } from "react"

export function UserGuideCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="rounded-xl border-0 shadow-md overflow-hidden">
      <CardHeader
        className="pb-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "linear-gradient(to right, #010059, rgba(1, 0, 89, 0.9))",
          color: "white",
        }}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Info className="mr-2 h-5 w-5" /> Guia do Usuário
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 h-auto"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        <CardDescription className="text-white/80">Como baixar seus comprovantes de pagamento</CardDescription>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-[#010059]">Passo a passo:</h3>
              <ol className="space-y-2 pl-5 list-decimal text-sm">
                <li>
                  Selecione um veículo na seção "Meus Veículos" ou use "Todos os Veículos" para ver todos os
                  comprovantes
                </li>
                <li>Navegue pelos comprovantes disponíveis na seção à direita</li>
                <li>
                  Clique no botão{" "}
                  <span className="inline-flex items-center bg-[#f58634] text-white p-1 rounded-md text-xs">
                    <Download className="h-3 w-3" />
                  </span>{" "}
                  para baixar o comprovante desejado
                </li>
                <li>O arquivo será salvo automaticamente na pasta de downloads do seu dispositivo</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-[#010059]">Dicas úteis:</h3>
              <ul className="space-y-2 pl-5 list-disc text-sm">
                <li>Use a barra de busca para encontrar comprovantes específicos por número, período ou placa</li>
                <li>Filtre por "Recentes" para ver apenas os comprovantes mais recentes</li>
                <li>Os comprovantes baixados aparecerão na aba "Baixados" para fácil acesso</li>
              </ul>
            </div>

            <div className="bg-[#f2f3f3] p-3 rounded-lg text-sm">
              <p className="font-medium text-[#010059] mb-1">Precisa de ajuda?</p>
              <p className="text-gray-600">
                Se tiver dificuldades para baixar seus comprovantes, entre em contato com nosso suporte através do
                telefone 0800-123-4567 ou pelo e-mail suporte@novoseguros.com.br
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
