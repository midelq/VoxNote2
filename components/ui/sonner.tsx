"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon, Sparkles } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Sparkles className="size-4 text-violet-400" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-400" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-400" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-400" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-violet-400" />
        ),
      }}
      style={
        {
          "--normal-bg": "rgba(20, 20, 25, 0.95)",
          "--normal-text": "#f5f3ff", // violet-50
          "--normal-border": "rgba(139, 92, 246, 0.3)",
          "--border-radius": "99px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group backdrop-blur-xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)] flex items-center gap-2 px-6 py-3 min-w-max bg-gradient-to-r from-violet-950/40 to-black/20",
          title: "text-sm font-bold text-violet-50",
          description: "text-xs opacity-80",
          actionButton: "group-[.toast]:bg-violet-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
