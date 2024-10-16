import TrendsSideBar from "@/components/layout/trends-sidebar"
import UserAvatar from "@/components/layout/user-avatar"
import { Button } from "@/components/ui/button"
import FollowButton from "@/components/ui/follow-button"
import FollowerCount from "@/components/ui/follower-count"
import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import UserPostsFeed from "./user-posts-feed"

interface PageProps{
    params:{
        username:string
    }
}

const getUser= cache(async(username:string, loggedInUserId:string)=>{
    const user= await prisma.user.findFirst({
        where:{
            name:{
                equals:decodeURIComponent(username),
                mode:"insensitive"
            }
        },
        select: getUserDataSelect(loggedInUserId)
    })
    if(!user) notFound();
    return user;

})

export async function generateMetaData({params}:PageProps):Promise<Metadata> {
    const session= await getServerSession()
    const loggedInUser= session?.user
    if(!loggedInUser) return {}
    const user = await getUser(params.username, loggedInUser.id!)
    return {
        title:`${user.displayName} (@${user.name})`
    }

}
export default async function Page({params}:PageProps){
    const session= await getServerSession()
    const loggedInUser= session?.user
    if(!loggedInUser) return <p className="text-destructive"> You are not authorized to view this page.</p>
    const user = await getUser(params.username, loggedInUser.id!)

    return(
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <UserProfile user={user} loggedInUserId={loggedInUser.id!}/>
                <div className="rounded-2xl bg-card p-5 shadow-lg">
                    <h2 className="text-center text-2xl font-bold">
                        {user.displayName}&apos;s posts
                    </h2>
                </div>
                <UserPostsFeed userId={user.id}/>
            </div>
            <TrendsSideBar/>
        </main>
    )

}

interface UserDataProps{
    user:UserData;
    loggedInUserId: string
}

async function UserProfile({user, loggedInUserId}:UserDataProps) {
    const followerInfo:FollowerInfo={
        followers: user._count.followers,
        isFollowedByUser:user.followers.some(({followerId})=> followerId===loggedInUserId)
    }

    return(
        <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-lg">
            <UserAvatar avatarUrl={user.image} size={250} className="mx-auto size-full max-h-60 max-w-60 rounded-full"/>
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">{user.displayName}</h1>
                        <div className="text-muted-foreground">@{user.name}</div>
                    </div>
                    <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
                    <div className="flex items-center gap-3">
                        <span>
                            Posts :{" "}
                            <span className="font-semibold">
                                {formatNumber(user._count.posts)}
                            </span>
                        </span>
                        <FollowerCount userId={user.id} initialState={followerInfo}/>
                    </div>
                </div>
                {user.id===loggedInUserId ? (<Button>Edit</Button>): (<FollowButton userId={user.id} initialState={followerInfo} />)}
            </div>
            {user.bio && (
                <>
                <hr />
                <div className=" whitespace-pre-line overflow-hidden break-words">{user.bio}</div>
                </>
            )}
        </div>
    )
}