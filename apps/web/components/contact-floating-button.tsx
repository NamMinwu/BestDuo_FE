"use client"

import { MessageCircle } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { ContactDialog } from "@/components/contact-dialog"

export function ContactFloatingButton() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-end px-4 sm:bottom-6 sm:px-6">
      <ContactDialog
        trigger={
          <Button
            type="button"
            size="lg"
            className="pointer-events-auto h-10 gap-1.5 rounded-full px-4 shadow-lg shadow-primary/20"
            aria-label="문의하기"
          >
            <MessageCircle />
            <span className="text-xs font-semibold">문의</span>
          </Button>
        }
      />
    </div>
  )
}
