"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface ApiKeyCardProps {
  title: string
  keyValue: string
  status: "connected" | "invalid" | null
  helperText?: string
  linkText?: string
  linkUrl?: string
}

function ApiKeyCard({ title, keyValue, status, helperText, linkText, linkUrl }: ApiKeyCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async () => {
    setIsTesting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success(`${title} connection successful!`)
    setIsTesting(false)
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {helperText && <CardDescription>{helperText}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={title.toLowerCase().replace(/\s/g, "-")}>API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={title.toLowerCase().replace(/\s/g, "-")}
                type={isRevealed ? "text" : "password"}
                value={keyValue}
                readOnly
                className="pr-10"
              />
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>

        {status && (
          <div className="flex items-center gap-2">
            {status === "connected" ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Invalid</span>
              </>
            )}
          </div>
        )}

        {linkText && linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {linkText} <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}

export default function ApiKeysTab() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("API keys saved successfully!")
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Keep your API keys secure. Never share them publicly or commit to version control.
        </AlertDescription>
      </Alert>

      <ApiKeyCard
        title="OpenAI API Key"
        keyValue="sk-...xyz123"
        status="connected"
        linkText="Get your API key →"
        linkUrl="https://platform.openai.com/api-keys"
      />

      <ApiKeyCard
        title="DeepSeek API Key"
        keyValue="ds-...abc456"
        status={null}
        helperText="Optional - fallback when OpenAI fails"
        linkText="Get your API key →"
        linkUrl="https://platform.deepseek.com"
      />

      <ApiKeyCard
        title="Supabase Access Token"
        keyValue="sbp-...def789"
        status="connected"
        helperText="Optional - uses default project token if not provided"
        linkText="Get your access token →"
        linkUrl="https://supabase.com/dashboard"
      />

      <div className="pt-4 space-y-3">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Lock className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save API Keys"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">Last updated: Dec 20, 2025 at 3:45 PM</p>
      </div>
    </div>
  )
}
