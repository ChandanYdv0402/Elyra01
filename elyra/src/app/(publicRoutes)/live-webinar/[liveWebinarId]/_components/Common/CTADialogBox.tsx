"use client"
import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { WebinarWithPresenter } from "@/lib/type"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  webinar: WebinarWithPresenter
  userId: string
}

const CTADialogBox = ({ open, onOpenChange, trigger, webinar }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {webinar?.ctaType === "BOOK_A_CALL" ? "Book a Call" : "Buy Now"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {webinar?.ctaType === "BOOK_A_CALL"
              ? "You will be redirected to a call on another page"
              : "You will be redirected to checkout"}
          </p>
        </DialogHeader>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" className="text-muted-foreground">
            Cancel
          </Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CTADialogBox
