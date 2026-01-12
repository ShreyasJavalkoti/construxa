"use client"

import { useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function PreferencesTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState("light")

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Preferences saved successfully!")
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Construction Standards */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Construction Standards</CardTitle>
          <CardDescription>Configure your construction rate standards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rate Source</Label>
            <Select defaultValue="cpwd">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpwd">CPWD Rates</SelectItem>
                <SelectItem value="pwd">PWD Rates</SelectItem>
                <SelectItem value="custom">Custom Rates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Currency Format</Label>
            <RadioGroup defaultValue="rupee">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rupee" id="rupee" />
                <Label htmlFor="rupee" className="font-normal cursor-pointer">
                  ₹ (Rupee Symbol)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inr" id="inr" />
                <Label htmlFor="inr" className="font-normal cursor-pointer">
                  INR (Text)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Number Format</Label>
            <RadioGroup defaultValue="indian">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="indian" id="indian" />
                <Label htmlFor="indian" className="font-normal cursor-pointer">
                  Indian (12,34,567.89)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="international" id="international" />
                <Label htmlFor="international" className="font-normal cursor-pointer">
                  International (1,234,567.89)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Measurement Units */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Measurement Units</CardTitle>
          <CardDescription>Set your preferred measurement units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Length</Label>
              <Select defaultValue="meters">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Area</Label>
              <Select defaultValue="sqm">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqm">sq.m</SelectItem>
                  <SelectItem value="sqft">sq.ft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Volume</Label>
              <Select defaultValue="cum">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cum">cu.m</SelectItem>
                  <SelectItem value="cuft">cu.ft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weight</Label>
              <Select defaultValue="kg">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Date & Time</CardTitle>
          <CardDescription>Configure date and time formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select defaultValue="ddmmyyyy">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ddmmyyyy">DD/MM/YYYY (Indian Standard)</SelectItem>
                <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyymmdd">YYYY-MM-DD (ISO)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Time Format</Label>
            <RadioGroup defaultValue="24h">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="font-normal cursor-pointer">
                  24-hour
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h" className="font-normal cursor-pointer">
                  12-hour (AM/PM)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="ist">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">America/New_York (EST)</SelectItem>
                <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interface Preferences */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Interface Preferences</CardTitle>
          <CardDescription>Customize your interface experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Monitor },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      theme === item.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${theme === item.id ? "text-blue-600" : "text-gray-600"}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi" disabled>
                  Hindi (Coming Soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact View</Label>
              <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  )
}
