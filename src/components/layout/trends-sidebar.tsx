import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { getUserDataSelect } from "@/lib/types"
import { cn, formatNumber } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { unstable_cache } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"
import FollowButton from "../ui/follow-button"
import UserTooltip from "../ui/user-tooltip"
import UserAvatar from "./user-avatar"

export default function TrendsSideBar() {
    return (
        <div className="sticky top-[5.25rem] hidden md:block lg:w-80 w-72 h-fit flex-none space-y-5">
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                <WhoToFollow />
                <TrendingTopics />
            </Suspense>
        </div>
    )
}

async function WhoToFollow() {
    const session = await getServerSession()
    const user = session?.user
    if (!user) return null
    const usersToFollow = await prisma.user.findMany({
        where: {
            NOT: {
                id: user?.id
            },
            followers: {
                none: {
                    followerId: user.id
                }
            }
        },
        select: getUserDataSelect(user.id!),
        take: 5
    })

    return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-lg">
            <Link href={'/users/whoToFollow'}><div className="text-xl font-bold hover:underline">
                Who to follow
            </div></Link>
            {usersToFollow.map(user => (
                <div key={user.id} className="flex items-center justify-between gap-3">
                    <UserTooltip user={user}>
                        <Link href={`/users/${user.displayName}`} className="flex items-center gap-3">
                            <UserAvatar avatarUrl={user.image} className="flex-none" />
                            <div>
                                <p className="line-clamp-1 break-all font-semibold hover:underline">
                                    @{user.displayName}
                                </p>
                                <p className="line-clamp-1 break-all text-muted-foreground">
                                    {user.name}
                                </p>
                            </div>
                        </Link>
                    </UserTooltip>
                    <FollowButton userId={user.id} initialState={{ followers: user._count.followers, isFollowedByUser: user.followers.some(({ followerId }) => followerId === user.id) }} />
                </div>
            ))}
        </div>
    )
}

// this will only cache in production
const getTrendingTopics = unstable_cache(
    async (numberOfTopics: number) => {
        const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT ${numberOfTopics}
        `;

        return result.map(row => ({
            hashtag: row.hashtag,
            count: Number(row.count)
        }))
    },
    ["trending_topics"],
    {
        revalidate: 3 * 60 * 60
    }
)

export async function TrendingTopics({ numberOfTopics = 5, className }: { numberOfTopics?: number, className?: string }) {
    const trendingTopics = await getTrendingTopics(numberOfTopics);
    return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-lg">
            <div className="text-xl font-bold">
                Trending topics
            </div>
            {trendingTopics.map(({ hashtag, count }) => {
                const title = hashtag.split('#')[1];
                return <Link key={title} href={`/hashtag/${title}`} className="block">
                    <p className={cn("line-clamp-1 break-all font-semibold hover:underline", className)} title={hashtag}>{hashtag}</p>
                    <p className="text-sm text-muted-foreground">{formatNumber(count)}{count === 1 ? ' post' : " posts"}</p>
                </Link>
            })}
        </div>
    )
}