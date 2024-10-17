'use client';
import { FollowerInfo, UserData } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserAvatar from "../layout/user-avatar";
import FollowButton from "./follow-button";
import FollowerCount from "./follower-count";
import Linkify from "./linkify";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface UserToolTipPops extends PropsWithChildren {
    user: UserData
}

export default function UserTooltip({ children, user }: UserToolTipPops) {
    const session = useSession()
    const loggedInUser = session.data?.user

    const followerState: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.some(({ followerId }) => followerId === loggedInUser?.id)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
                        <div className="flex items-center justify-between gap-2">
                            <Link href={`/users/${user.displayName}`}>
                                <UserAvatar size={70} avatarUrl={user.image} />
                            </Link>
                            {loggedInUser?.id !== user.id && (<FollowButton userId={user.id} initialState={followerState} />)}
                        </div>
                        <div>
                            <Link href={`/users/${user.displayName}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user.displayName}
                                </div>
                                <div className="text-muted-foreground">@{user.name}</div>
                            </Link>
                        </div>
                        {user.bio && (
                            <Linkify>
                                <div className=" line-clamp-4 whitespace-pre-line break-words">{user.bio}</div>
                            </Linkify>
                        )}
                        <FollowerCount userId={user.id} initialState={followerState}/>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}