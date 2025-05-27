"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, User, UserCircle } from "lucide-react"
import { useState } from "react"

interface UserInfoCardProps {
  userData: {
    name: string
    email: string
    clientSince: string
    totalPolicies: number
    totalMonthlyValue: string
    status: string
  }
}

export function UserInfoCard({ userData }: UserInfoCardProps) {
  const [isOpen, setIsOpen] = useState(() => (false))

  return (
    <Card className="rounded-xl border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2 cursor-pointer bg-[#f58634]" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center">
            <UserCircle className="mr-2 h-5 w-5" /> Informações da Conta
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
        <CardDescription className="text-white/80">Veja as suas informações pessoais</CardDescription>
      </CardHeader>

      {isOpen && (
        <>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/yoda.jpg?height=64&width=64" alt="Usuário" />
                <AvatarFallback className="bg-[#f58634] text-xl">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <Badge className="mt-1 bg-[#010059]">{userData.totalPolicies} Veículos Ativos</Badge>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Cliente desde</span>
                <span className="font-medium">{userData.clientSince}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Total de Apólices</span>
                <span className="font-medium">{userData.totalPolicies}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Valor Total Mensal</span>
                <span className="font-medium">{userData.totalMonthlyValue}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-green-600">{userData.status}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#f58634] hover:bg-[#f58634]/90 rounded-lg">
              <User className="mr-2 h-4 w-4" /> Ver Perfil Completo
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
