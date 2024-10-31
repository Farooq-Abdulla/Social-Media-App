'use client'

import { Copy, Share } from "lucide-react"
import { useCallback, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'


export function ShareButton({ linkToCopy }: { linkToCopy: string }) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(linkToCopy).then(() => {
            setOpen(false)
            toast({
                description: "Link copied to clipboard!",
            })
        }).catch((err) => {
            console.error('Failed to copy: ', err)
            toast({
                variant: "destructive",
                description: "Failed to copy link. Please try again.",
            })
        })
    }, [linkToCopy, toast])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <Share className="size-5" />
                    <span className="text-sm font-medium hidden sm:inline">share</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={linkToCopy}
                            readOnly
                        />
                    </div>
                    <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}