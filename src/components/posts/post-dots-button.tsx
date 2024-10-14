import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import DeleteDialog from "./delete-dialog";

interface PostDotsButtonProps {
    post: PostData;
    className?: string;
}

export default function PostDotsButton({ post, className }: PostDotsButtonProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={"ghost"} className={className}>
                        <MoreHorizontal className="size-5 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                        <span className="flex items-center gap-3 text-destructive">
                            <Trash2 className="size-4" />
                            Delete
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
        </>
    )
}