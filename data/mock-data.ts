import type { Car, PaymentSlip } from "@/types"

// Mock data for cars
export const cars: Car[] = [
  {
    id: "car-001",
    make: "Chevrolet",
    model: "Montana",
    year: "2021",
    licensePlate: "ABC-1234",
    color: "Branco",
    policyNumber: "APL-12345",
    premium: "R$ 745,00",
    status: "Ativa",
  },
  {
    id: "car-002",
    make: "Toyota",
    model: "Corolla",
    year: "2022",
    licensePlate: "DEF-5678",
    color: "Prata",
    policyNumber: "APL-12346",
    premium: "R$ 892,00",
    status: "Ativa",
  },
  {
    id: "car-003",
    make: "Honda",
    model: "Civic",
    year: "2020",
    licensePlate: "GHI-9012",
    color: "Preto",
    policyNumber: "APL-12347",
    premium: "R$ 1.120,00",
    status: "Ativa",
  },
  {
    id: "car-004",
    make: "Volkswagen",
    model: "Gol",
    year: "2019",
    licensePlate: "JKL-3456",
    color: "Azul",
    policyNumber: "APL-12348",
    premium: "R$ 654,00",
    status: "Ativa",
  },
  {
    id: "car-005",
    make: "Fiat",
    model: "Pulse",
    year: "2023",
    licensePlate: "MNO-7890",
    color: "Vermelho",
    policyNumber: "APL-12349",
    premium: "R$ 876,00",
    status: "Ativa",
  },
  {
    id: "car-006",
    make: "Hyundai",
    model: "HB20",
    year: "2022",
    licensePlate: "PQR-1234",
    color: "Prata",
    policyNumber: "APL-12350",
    premium: "R$ 732,00",
    status: "Ativa",
  },
  {
    id: "car-007",
    make: "Renault",
    model: "Kwid",
    year: "2021",
    licensePlate: "STU-5678",
    color: "Branco",
    policyNumber: "APL-12351",
    premium: "R$ 598,00",
    status: "Ativa",
  },
  {
    id: "car-008",
    make: "Jeep",
    model: "Renegade",
    year: "2023",
    licensePlate: "VWX-9012",
    color: "Verde",
    policyNumber: "APL-12352",
    premium: "R$ 1.245,00",
    status: "Ativa",
  },
]

// Helper function to generate dates
const generateDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleDateString("pt-BR")
}

// Helper function to generate due dates
const generateDueDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toLocaleDateString("pt-BR")
}

// Mock data for payment slips with varied statuses and dates
export const paymentSlips: PaymentSlip[] = [
  // Recent paid slips
  {
    id: "COMP-001",
    date: generateDate(2),
    amount: "R$ 745,00",
    status: "Pago",
    period: "Jan 2025",
    carId: "car-001",
    licensePlate: "ABC-1234",
    dueDate: generateDate(5),
    updatedAt: generateDate(2),
  },
  {
    id: "COMP-002",
    date: generateDate(5),
    amount: "R$ 892,00",
    status: "Pago",
    period: "Jan 2025",
    carId: "car-002",
    licensePlate: "DEF-5678",
    dueDate: generateDate(8),
    updatedAt: generateDate(5),
  },
  {
    id: "COMP-003",
    date: generateDate(1),
    amount: "R$ 1.120,00",
    status: "Pago",
    period: "Jan 2025",
    carId: "car-003",
    licensePlate: "GHI-9012",
    dueDate: generateDate(4),
    updatedAt: generateDate(1),
  },

  // Pending slips (recent)
  {
    id: "COMP-004",
    date: generateDate(3),
    amount: "R$ 654,00",
    status: "Pendente",
    period: "Fev 2025",
    carId: "car-004",
    licensePlate: "JKL-3456",
    dueDate: generateDueDate(5),
    updatedAt: generateDate(3),
  },
  {
    id: "COMP-005",
    date: generateDate(7),
    amount: "R$ 876,00",
    status: "Pendente",
    period: "Fev 2025",
    carId: "car-005",
    licensePlate: "MNO-7890",
    dueDate: generateDueDate(10),
    updatedAt: generateDate(7),
  },

  // Overdue slips
  {
    id: "COMP-006",
    date: generateDate(45),
    amount: "R$ 732,00",
    status: "Vencido",
    period: "Dez 2024",
    carId: "car-006",
    licensePlate: "PQR-1234",
    dueDate: generateDate(15),
    updatedAt: generateDate(10),
  },
  {
    id: "COMP-007",
    date: generateDate(60),
    amount: "R$ 598,00",
    status: "Vencido",
    period: "Nov 2024",
    carId: "car-007",
    licensePlate: "STU-5678",
    dueDate: generateDate(30),
    updatedAt: generateDate(25),
  },

  // More recent activity
  {
    id: "COMP-008",
    date: generateDate(10),
    amount: "R$ 1.245,00",
    status: "Pago",
    period: "Jan 2025",
    carId: "car-008",
    licensePlate: "VWX-9012",
    dueDate: generateDate(13),
    updatedAt: generateDate(10),
  },

  // Older paid slips
  {
    id: "COMP-009",
    date: generateDate(35),
    amount: "R$ 745,00",
    status: "Pago",
    period: "Dez 2024",
    carId: "car-001",
    licensePlate: "ABC-1234",
    dueDate: generateDate(38),
    updatedAt: generateDate(35),
  },
  {
    id: "COMP-010",
    date: generateDate(40),
    amount: "R$ 892,00",
    status: "Pago",
    period: "Nov 2024",
    carId: "car-002",
    licensePlate: "DEF-5678",
    dueDate: generateDate(43),
    updatedAt: generateDate(40),
  },

  // More pending slips
  {
    id: "COMP-011",
    date: generateDate(12),
    amount: "R$ 1.120,00",
    status: "Pendente",
    period: "Fev 2025",
    carId: "car-003",
    licensePlate: "GHI-9012",
    dueDate: generateDueDate(3),
    updatedAt: generateDate(12),
  },
  {
    id: "COMP-012",
    date: generateDate(20),
    amount: "R$ 654,00",
    status: "Pendente",
    period: "Jan 2025",
    carId: "car-004",
    licensePlate: "JKL-3456",
    dueDate: generateDueDate(1),
    updatedAt: generateDate(15),
  },

  // Additional overdue
  {
    id: "COMP-013",
    date: generateDate(50),
    amount: "R$ 876,00",
    status: "Vencido",
    period: "Out 2024",
    carId: "car-005",
    licensePlate: "MNO-7890",
    dueDate: generateDate(20),
    updatedAt: generateDate(18),
  },
]

// Mock user data
export const userData = {
  name: "Pablo Gerbassi",
  email: "pablo.gerbassi@exemplo.com",
  clientSince: "Janeiro 2020",
  totalPolicies: cars.length,
  totalMonthlyValue: "R$ 3.411,00",
  status: "Em dia",
}

// Support data
export const supportData = {
  phone: "0800-123-4567",
  email: "suporte@novoseguros.com.br",
  hours: "Seg-Sex, 8h-20h",
}
