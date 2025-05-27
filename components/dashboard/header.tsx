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
          <div className="flex flex-col">
            <span className="font-bold text-[#010059] text-sm sm:text-base">Portal do Segurado</span>
            <span className="text-xs text-gray-500 sm:hidden">{vehicleCount} veículos</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Avatar className="h-8 w-8 hidden md:block lg:block">
            <AvatarImage src="/yoda.jpg?height=32&width=32" alt="Usuário" />
            <AvatarFallback className="bg-[#f58634] text-xs">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{vehicleCount} veículos segurados</p>
          </div>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/">
              <LogOut className="h-4 w-4 text-gray-500" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
