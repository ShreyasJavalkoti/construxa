"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Chrome, Smartphone, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

const sessions = [
  {
    device: "Chrome on Windows",
    location: "Pune, India",
    lastActive: "2 minutes ago",
    isCurrent: true,
    icon: Chrome,
  },
  {
    device: "Safari on iPhone",
    location: "Mumbai, India",
    lastActive: "2 hours ago",
    isCurrent: false,
    icon: Smartphone,
  },
]

const loginActivity = [
  { date: "Dec 26, 2025 3:45 PM", location: "Pune, India", ip: "103.x.x.x", status: "success" },
  { date: "Dec 25, 2025 9:20 AM", location: "Mumbai, India", ip: "117.x.x.x", status: "success" },
  { date: "Dec 24, 2025 6:30 PM", location: "Pune, India", ip: "103.x.x.x", status: "success" },
  { date: "Dec 23, 2025 11:15 AM", location: "Delhi, India", ip: "122.x.x.x", status: "failed" },
  { date: "Dec 22, 2025 4:00 PM", location: "Pune, India", ip: "103.x.x.x", status: "success" },
]

export default function SecurityTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const newPassword = watch("newPassword")

  // Calculate password strength
  useState(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (newPassword.length >= 8) strength += 25
    if (/[A-Z]/.test(newPassword)) strength += 25
    if (/[0-9]/.test(newPassword)) strength += 25
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25
    setPasswordStrength(strength)
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Password updated successfully!")
    setIsLoading(false)
    reset()
  }

  const handleEnable2FA = () => {
    setIs2FAEnabled(true)
    toast.success("Two-Factor Authentication enabled!")
  }

  const handleSignOutSession = (device: string) => {
    toast.success(`Signed out from ${device}`)
  }

  const handleSignOutAll = () => {
    toast.success("Signed out from all other sessions")
  }

  const handleExportData = () => {
    toast.success("Data export started. You will receive an email shortly.")
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion initiated. This action cannot be undone.")
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password regularly for better security</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
                className={errors.currentPassword ? "border-red-500" : ""}
              />
              {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500" : ""}
              />
              {newPassword && (
                <div className="space-y-1">
                  <Progress
                    value={passwordStrength}
                    className={`h-2 ${
                      passwordStrength < 50
                        ? "[&>div]:bg-red-500"
                        : passwordStrength < 75
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password strength: {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                  </p>
                </div>
              )}
              {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Password requirements:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  {newPassword?.length >= 8 ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-gray-400" />
                  )}
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  {/[A-Z]/.test(newPassword || "") ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-gray-400" />
                  )}
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  {/[0-9]/.test(newPassword || "") ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-gray-400" />
                  )}
                  One number
                </li>
                <li className="flex items-center gap-2">
                  {/[^A-Za-z0-9]/.test(newPassword || "") ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-gray-400" />
                  )}
                  One special character
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add extra security to your account</CardDescription>
            </div>
            <Badge variant={is2FAEnabled ? "default" : "secondary"} className={is2FAEnabled ? "bg-green-600" : ""}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!is2FAEnabled ? (
            <Button onClick={handleEnable2FA} variant="outline">
              Enable 2FA
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-green-600">Two-factor authentication is active on your account.</p>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                Disable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you're currently logged in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, idx) => {
            const Icon = session.icon
            return (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                    <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                  </div>
                </div>
                {session.isCurrent ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Current Session
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleSignOutSession(session.device)}>
                    Sign Out
                  </Button>
                )}
              </div>
            )
          })}
          <Button
            variant="outline"
            onClick={handleSignOutAll}
            className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
          >
            Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Login Activity</CardTitle>
          <CardDescription>Recent login attempts on your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {loginActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border-l-4 border-gray-200 pl-4 bg-gray-50 rounded-r"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.location} • {activity.ip}
                  </p>
                </div>
                {activity.status === "success" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Success
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Failed
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-600">
            View Full History
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-50 border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700">Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <p className="font-medium">Export All Data</p>
              <p className="text-sm text-muted-foreground">Download all your project data (GDPR compliance)</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">Permanently delete your account and all data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
