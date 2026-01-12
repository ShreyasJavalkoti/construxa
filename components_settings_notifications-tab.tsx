"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const emailNotifications = [
  {
    id: "project-updates",
    label: "Project updates",
    description: "New drawings uploaded, analysis completed",
    defaultChecked: true,
  },
  {
    id: "timeline-complete",
    label: "Timeline generation complete",
    description: "Receive timeline ready notifications",
    defaultChecked: true,
  },
  {
    id: "boq-complete",
    label: "BOQ generation complete",
    description: "Get notified when BOQ is ready",
    defaultChecked: true,
  },
  {
    id: "weekly-summary",
    label: "Weekly summary",
    description: "Summary of your account activity",
    defaultChecked: true,
  },
  {
    id: "marketing",
    label: "Marketing emails",
    description: "Product updates and special offers",
    defaultChecked: false,
  },
]

export default function NotificationsTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState(
    emailNotifications.reduce(
      (acc, notif) => ({
        ...acc,
        [notif.id]: notif.defaultChecked,
      }),
      {} as Record<string, boolean>,
    ),
  )

  const handleToggle = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleUnsubscribeAll = () => {
    setNotifications(
      emailNotifications.reduce(
        (acc, notif) => ({
          ...acc,
          [notif.id]: false,
        }),
        {},
      ),
    )
    toast.success("Unsubscribed from all notifications")
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Notification preferences saved!")
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3">
              <Checkbox
                id={notification.id}
                checked={notifications[notification.id]}
                onCheckedChange={() => handleToggle(notification.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={notification.id} className="font-medium cursor-pointer">
                  {notification.label}
                </Label>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <button onClick={handleUnsubscribeAll} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Unsubscribe from all
            </button>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        {isLoading ? "Saving..." : "Save Notification Preferences"}
      </Button>
    </div>
  )
}
