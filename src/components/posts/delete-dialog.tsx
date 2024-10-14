import { useDeletePost } from "@/hooks/use-delete-post";
import { PostData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeletePostDialogProps {
    post: PostData;
    open: boolean;
    onClose: () => void
}
export default function DeleteDialog({ post, open, onClose }: DeletePostDialogProps) {
    const mutation = useDeletePost();
    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose()
        }
    }
    return <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Post ?</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant={"outline"} onClick={onClose} disabled={mutation.isPending} className="rounded-md">Cancel</Button>
                <Button variant={"destructive"} disabled={mutation.isPending} onClick={()=> mutation.mutate(post.id, {onSuccess: onClose} )}>Delete {mutation.isPending && <Loader2 className="size-5 mx-auto animate-ping"/>} </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}