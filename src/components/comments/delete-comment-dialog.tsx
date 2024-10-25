import { useDeleteComment } from "@/hooks/use-delete-comment";
import { CommentData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteCommentDialogProps {
    comment: CommentData ;
    open: boolean;
    onClose: () => void
}
export default function DeleteCommentDialog({ comment, open, onClose }: DeleteCommentDialogProps) {
    const mutation = useDeleteComment();
    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose()
        }
    }
    return <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Comment ?</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this comment? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant={"outline"} onClick={onClose} disabled={mutation.isPending} className="rounded-md">Cancel</Button>
                <Button variant={"destructive"} disabled={mutation.isPending} onClick={()=> mutation.mutate(comment.id, {onSuccess: onClose} )}>Delete {mutation.isPending && <Loader2 className="size-5 mx-auto animate-ping"/>} </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}