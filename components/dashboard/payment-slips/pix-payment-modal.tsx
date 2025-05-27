"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import type { PaymentSlip } from "@/types"
import { Check, Copy, CreditCard, Info, QrCode, Smartphone } from "lucide-react"
import { useState } from "react"

interface PIXPaymentModalProps {
  slip: PaymentSlip
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PIXPaymentModal({ slip, open, onOpenChange }: PIXPaymentModalProps) {
  const [isPixCopied, setIsPixCopied] = useState(false)

  // Function to generate PIX code (mock implementation)
  const generatePixCode = (slip: PaymentSlip) => {
    return `00020126580014BR.GOV.BCB.PIX0136${slip.id}-${slip.carId}-${Date.now()}5204000053039865802BR5925NOVO SEGUROS LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  // Function to copy PIX code to clipboard
  const handleCopyPixCode = async () => {
    const pixCode = generatePixCode(slip)

    try {
      await navigator.clipboard.writeText(pixCode)
      setIsPixCopied(true)

      toast({
        title: "Código PIX copiado",
        description: "O código PIX foi copiado para a área de transferência.",
      })

      setTimeout(() => {
        setIsPixCopied(false)
      }, 3000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-3xl border-2">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-[#010059] text-2xl font-bold">
            <div className="bg-[#010059]/10 p-3 rounded-2xl mr-4">
              <CreditCard className="h-6 w-6" />
            </div>
            Pagamento via PIX
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Copie o código PIX abaixo e cole no aplicativo do seu banco para efetuar o pagamento de forma rápida e
            segura.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Details Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#010059]" />
              Detalhes do Pagamento
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Comprovante:</span>
                <span className="font-bold text-[#010059]">{slip.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Período:</span>
                <span className="font-semibold">{slip.period}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Veículo:</span>
                <span className="font-semibold">{slip.licensePlate}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <span className="text-gray-600 font-medium">Valor:</span>
                <span className="font-bold text-2xl text-[#010059]">{slip.amount}</span>
              </div>
            </div>
          </div>

          {/* PIX Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="h-5 w-5 text-[#010059]" />
              <label className="text-base font-semibold text-gray-900">Código PIX:</label>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 p-4 bg-gray-50 rounded-2xl border-2 text-sm font-mono break-all max-h-24 overflow-y-auto leading-relaxed">
                {generatePixCode(slip)}
              </div>
              <Button
                size="lg"
                onClick={handleCopyPixCode}
                className={`px-4 h-16 flex-shrink-0 rounded-2xl font-semibold transition-all duration-200 ${
                  isPixCopied
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-[#010059] hover:bg-[#010059]/90 text-white"
                }`}
              >
                {isPixCopied ? (
                  <div className="flex flex-col items-center gap-1">
                    <Check className="h-5 w-5" />
                    <span className="text-xs">Copiado</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Copy className="h-5 w-5" />
                    <span className="text-xs">Copiar</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-2xl">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 text-lg">Como pagar:</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 leading-relaxed">
              <li className="font-medium">Copie o código PIX acima</li>
              <li className="font-medium">Abra o aplicativo do seu banco</li>
              <li className="font-medium">Escolha a opção "PIX" e depois "Colar código"</li>
              <li className="font-medium">Cole o código e confirme o pagamento</li>
            </ol>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-2xl flex-shrink-0">
                <Info className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante:</h3>
                <p className="text-yellow-800 leading-relaxed">
                  O pagamento via PIX é processado instantaneamente. Após a confirmação, seu comprovante será atualizado
                  em até 2 horas úteis.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-2xl border-2 text-base font-semibold"
            >
              Fechar
            </Button>
            <Button
              onClick={handleCopyPixCode}
              className="flex-1 h-12 bg-[#010059] hover:bg-[#010059]/90 rounded-2xl text-base font-semibold"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Código PIX
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
