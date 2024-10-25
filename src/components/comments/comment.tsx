import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserAvatar from "../layout/user-avatar";
import UserTooltip from "../ui/user-tooltip";
import CommentMoreButton from "./comments-more-button";

interface CommentProps {
    comment: CommentData
}

export default function Comment({ comment }: CommentProps) {
    const session= useSession()
    const user= session.data?.user
    return (
        <div className="flex gap-3 py-3 group/comment">
            <span className="hidden sm:inline">
                <UserTooltip user={comment.user}>
                    <Link href={`/users/${comment.user.displayName}`}>
                        <UserAvatar avatarUrl={comment.user.image} size={40} />
                    </Link>
                </UserTooltip>
            </span>
            <div>
                <div className="flex items-center gap-1 text-sm">
                    <UserTooltip user={comment.user}>
                        <Link href={`/users/${comment.user.displayName}`} className="font-medium hover:underline">
                            {comment.user.displayName}
                        </Link>
                    </UserTooltip>
                    <span className="text-muted-foreground" suppressHydrationWarning>
                        {formatRelativeDate(new Date(comment.createdAt))}
                    </span>
                </div>
                <div>{comment.content}</div>
            </div>
            {comment.user.id===user?.id && (
                <CommentMoreButton comment={comment} className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"/>
            )}
        </div>
    )
}