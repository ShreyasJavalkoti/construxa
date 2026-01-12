"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X, Download } from "lucide-react"

const plans = [
  {
    name: "FREE",
    price: "₹0",
    period: "/month",
    isCurrent: true,
    features: [
      { text: "3 projects", included: true },
      { text: "10 drawings/month", included: true },
      { text: "1GB storage", included: true },
      { text: "Basic support", included: true },
      { text: "Analytics", included: false },
      { text: "API Access", included: false },
      { text: "Custom Rates", included: false },
    ],
  },
  {
    name: "PRO",
    price: "₹1,999",
    period: "/month",
    isPopular: true,
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Unlimited drawings", included: true },
      { text: "50GB storage", included: true },
      { text: "Priority support", included: true },
      { text: "Analytics", included: true },
      { text: "API Access", included: true },
      { text: "Custom Rates", included: true },
    ],
  },
  {
    name: "ENTERPRISE",
    price: "Contact Sales",
    period: "",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Unlimited drawings", included: true },
      { text: "Custom storage", included: true },
      { text: "Dedicated support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "API Access", included: true },
      { text: "Custom Rates", included: true },
    ],
  },
]

const billingHistory = [
  { date: "Dec 1, 2025", description: "Pro Plan", amount: "₹1,999", status: "Paid" },
  { date: "Nov 1, 2025", description: "Pro Plan", amount: "₹1,999", status: "Paid" },
  { date: "Oct 1, 2025", description: "Pro Plan", amount: "₹1,999", status: "Paid" },
]

export default function SubscriptionTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300">
        <CardHeader>
          <Badge className="w-fit mb-2 bg-blue-600">CURRENT PLAN</Badge>
          <CardTitle className="text-3xl">Free Plan</CardTitle>
          <CardDescription className="text-xl font-bold text-foreground">₹0/month</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>3 projects</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>10 drawings per month</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Basic support</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Community access</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Your current usage this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Projects</span>
              <span className="text-muted-foreground">2/3 used</span>
            </div>
            <Progress value={66} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Drawings</span>
              <span className="text-orange-600 font-medium">8/10 used</span>
            </div>
            <Progress value={80} className="h-2 [&>div]:bg-orange-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Storage</span>
              <span className="text-muted-foreground">120MB/1GB</span>
            </div>
            <Progress value={12} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border-2 p-6 space-y-4 ${
                  plan.isPopular ? "border-blue-500 bg-blue-50 relative" : "border-gray-200 bg-white"
                }`}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500">
                    POPULAR
                  </Badge>
                )}
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {plan.isCurrent ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : plan.name === "PRO" ? (
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Us
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your payment history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 font-medium">{item.amount}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
