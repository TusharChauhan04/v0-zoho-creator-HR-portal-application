"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const payrollHistory = [
  { month: "December 2024", amount: 5500, status: "Paid", date: "Dec 31, 2024" },
  { month: "November 2024", amount: 5500, status: "Paid", date: "Nov 30, 2024" },
  { month: "October 2024", amount: 5500, status: "Paid", date: "Oct 31, 2024" },
  { month: "September 2024", amount: 5200, status: "Paid", date: "Sep 30, 2024" },
]

export default function PayrollPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">View your salary and payment history</p>
        </div>

        {/* Current Salary Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,500</div>
              <p className="text-xs text-muted-foreground">Gross salary</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,675</div>
              <p className="text-xs text-muted-foreground">After deductions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 31</div>
              <p className="text-xs text-muted-foreground">2025</p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Breakdown</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium">Basic Salary</span>
                <span className="font-bold">$4,000</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium">House Rent Allowance</span>
                <span className="font-bold">$800</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium">Transport Allowance</span>
                <span className="font-bold">$300</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium">Other Allowances</span>
                <span className="font-bold">$400</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <span className="font-medium">Gross Salary</span>
                <span className="text-lg font-bold">$5,500</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b text-red-600 dark:text-red-400">
                <span className="text-sm font-medium">Tax Deductions</span>
                <span className="font-bold">-$550</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b text-red-600 dark:text-red-400">
                <span className="text-sm font-medium">Insurance</span>
                <span className="font-bold">-$275</span>
              </div>
              <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                <span className="text-lg font-medium">Net Salary</span>
                <span className="text-2xl font-bold">$4,675</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your salary payment records</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollHistory.map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold">${payment.amount.toLocaleString()}</p>
                    <Badge variant="secondary">{payment.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
