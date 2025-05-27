// Define types for our data models
export interface Car {
  id: string
  make: string
  model: string
  year: string
  licensePlate: string
  color: string
  policyNumber: string
  premium: string
  status: string
}

export type CarType = Car

export interface PaymentSlip {
  id: string
  date: string
  amount: string
  status: "Pago" | "Pendente" | "Vencido"
  period: string
  carId: string
  licensePlate: string
  dueDate?: string
  updatedAt?: string
}

export interface UserInfo {
  name: string
  email: string
  clientSince: string
  status: string
}

export type TabType = "all" | "pending" | "paid" | "overdue"
