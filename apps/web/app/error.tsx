"use client"

import { useEffect } from "react"

import { Button } from "@workspace/ui/components/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-lg font-medium">문제가 발생했습니다</h1>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {error.message}
      </p>
      <Button type="button" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  )
}
