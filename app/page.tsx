"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Validar credenciais
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f3f3]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
            <div className="bg-transparent text-white p-2 rounded-full">
              <img
                src="logo-novo-seguros.svg"
                alt="Logo"
                className="w-24 h-18 mt-3 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#010059]">Portal do Segurado</h1>
          <p className="text-gray-600">Seu seguro em dia, sem complicações.</p>
        </div>

        <Card className="border-0 shadow-lg rounded-xl">
          <CardHeader className="space-y-1">
            {/*<CardTitle className="text-xl text-center text-[#010059]">Entrar</CardTitle>*/}
            <CardDescription className="text-center">Digite suas credenciais para acessar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-sm text-[#f58634] hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#010059] hover:bg-[#f58634]/90 rounded-lg">
                 Entrar
                <LogIn className="mr-0 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a href="#" className="text-[#f58634] hover:underline">
                Entre em contato com o suporte
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
