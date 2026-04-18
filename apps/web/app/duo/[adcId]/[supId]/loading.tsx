import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-6">
          <Skeleton className="size-14 shrink-0 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-[200px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
