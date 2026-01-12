"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, SettingsIcon, Key, CreditCard, Shield, Bell, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileTab from "@/components/settings/profile-tab"
import PreferencesTab from "@/components/settings/preferences-tab"
import ApiKeysTab from "@/components/settings/api-keys-tab"
import SubscriptionTab from "@/components/settings/subscription-tab"
import SecurityTab from "@/components/settings/security-tab"
import NotificationsTab from "@/components/settings/notifications-tab"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SettingsIcon },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Settings</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Tabs Layout */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-6">
          {/* Vertical Tabs Sidebar */}
          <div className="lg:w-56 shrink-0">
            <TabsList className="flex flex-col h-auto w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-2 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <TabsContent value="profile" className="mt-0">
                <ProfileTab />
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <PreferencesTab />
              </TabsContent>

              <TabsContent value="api-keys" className="mt-0">
                <ApiKeysTab />
              </TabsContent>

              <TabsContent value="subscription" className="mt-0">
                <SubscriptionTab />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <SecurityTab />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <NotificationsTab />
              </TabsContent>
            </motion.div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
