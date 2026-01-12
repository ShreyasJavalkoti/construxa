"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  countryCode: z.string(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg?height=120&width=120")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Shreyas Javalkot",
      email: "shreyas@example.com",
      company: "",
      countryCode: "+91",
      phone: "",
      jobTitle: "",
      location: "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Profile data:", data)
    toast.success("Profile updated successfully!")
    setIsLoading(false)
    reset(data)
  }

  const handleUploadPhoto = () => {
    toast.success("Photo uploaded successfully!")
  }

  const handleRemovePhoto = () => {
    setAvatarUrl("/placeholder.svg?height=120&width=120")
    toast.success("Photo removed")
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 p-1">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-gray-100"
                />
              </div>
              <button
                onClick={handleUploadPhoto}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:shadow-lg transition-shadow"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleUploadPhoto}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Upload Photo
              </Button>
              <button onClick={handleRemovePhoto} className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove Photo
              </button>
              <p className="text-xs text-muted-foreground">JPG or PNG. Max 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register("fullName")} className={errors.fullName ? "border-red-500" : ""} />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" disabled {...register("email")} className="bg-gray-100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Company" {...register("company")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+91">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="phone" type="tel" className="flex-1" {...register("phone")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="Civil Engineer" {...register("jobTitle")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Pune, Maharashtra" {...register("location")} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!isDirty || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
