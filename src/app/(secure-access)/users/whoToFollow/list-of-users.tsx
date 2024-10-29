
import UserAvatar from "@/components/layout/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import FollowButton from "@/components/ui/follow-button";
import FollowerCount from "@/components/ui/follower-count";
import FollowingCount from "@/components/ui/following-count";
import Linkify from "@/components/ui/linkify";
import UserTooltip from "@/components/ui/user-tooltip";
import { FollowerInfo, FollowingInfo, UserData } from "@/lib/types";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

export function ListOfUsers({ user, loggedInUserId }: { user: UserData, loggedInUserId: string }) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUserId)
  }
  const followingInfo: FollowingInfo = {
    following: user._count.following
  }
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <UserTooltip user={user}>
              <Link href={`/users/${user.displayName}`} className="flex-shrink-0">
                <UserAvatar avatarUrl={user.image} className="w-16 h-16 rounded-full sm:w-20 sm:h-20 object-cover" />
              </Link>
            </UserTooltip>
            <div className="space-y-2">
              <div>
                <UserTooltip user={user}>
                  <Link className="text-lg font-semibold hover:underline" href={`/users/${user.displayName}`}>
                    {user.displayName}
                  </Link>
                </UserTooltip>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span suppressHydrationWarning>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              {user.bio && (
                <Linkify>
                  <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                </Linkify>
              )}
              {/* {user.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )} */}
              <div className="flex gap-3">
                <FollowerCount userId={user.id} initialState={followerInfo} />
                <FollowingCount userId={user.id} initialState={followingInfo} />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end gap-2">
            <FollowButton userId={user.id} initialState={followerInfo} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
