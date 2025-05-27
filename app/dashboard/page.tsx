"use client"

import { CarList } from "@/components/dashboard/car-list"
import { DashboardHeader } from "@/components/dashboard/header"
import { HelpSupport } from "@/components/dashboard/help-support"
import { PaymentSlips } from "@/components/dashboard/payment-slips"
import { UserGuideCard } from "@/components/dashboard/user-guide"
import { UserInfoCard } from "@/components/dashboard/user-info"
import { cars, paymentSlips, supportData, userData } from "@/data/mock-data"
import { useState } from "react"

export default function Dashboard() {
  const [selectedCar, setSelectedCar] = useState<string>("all")

  return (
    <div className="min-h-screen bg-[#f2f3f3]">
      {/* Header */}
      <DashboardHeader userName={userData.name} vehicleCount={cars.length} />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - User info and cars */}
          <div className="lg:col-span-1 space-y-6">

            <div className="hidden lg:col-span-1 space-y-6 lg:block">
              <UserInfoCard userData={userData} />
              <CarList cars={cars} selectedCar={selectedCar} onSelectCar={setSelectedCar} />

              <UserGuideCard />
              <HelpSupport supportData={supportData} />
            </div>
          </div>

          {/* Right column - Payment slips */}
          <div className="lg:col-span-2 space-y-6">
            <PaymentSlips
              paymentSlips={paymentSlips}
              cars={cars}
              selectedCar={selectedCar}
              onSelectCar={setSelectedCar}
            />
            <div className="lg:hidden lg:col-span-1 space-y-6">
              <UserInfoCard userData={userData} />
              <CarList cars={cars} selectedCar={selectedCar} onSelectCar={setSelectedCar} />
              <UserGuideCard />
              <HelpSupport supportData={supportData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
