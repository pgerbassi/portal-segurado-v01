"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  userName: string
  vehicleCount: number
}

export function DashboardHeader({ userName, vehicleCount }: HeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <div className="bg-transparent text-white p-2 rounded-full">
              <img
                src="logo-novo-seguros.svg"
                alt="Logo"
                className="w-24 h-18 mt-3 object-contain"
              />
            </div>
          <span className="font-bold text-[#010059] hidden sm:block">Portal do Segurado</span>
          <span className="font-bold text-[#010059] sm:hidden">Portal do Segurado</span>
        </div>

        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/yoda.jpg?height=32&width=32" alt="Usuário" />
            <AvatarFallback className="bg-[#f58634]">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{vehicleCount} veículos segurados</p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
