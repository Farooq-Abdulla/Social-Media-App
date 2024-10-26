import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Bookmark, Home } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { Button } from "../ui/button"
import NotificationButton from "./notifications-button"

async function MenuBar({className}:{className?:  string}){
    const session= await getServerSession()
    const user= session?.user
    if(!user) return null
    const unreadNotificationCount= await prisma.notification.count({
        where :{
            recipientId: user.id!,
            read: false
        }
    })
    return(
        <div className={cn("", className)}>
            <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Home" asChild>
                <Link href={"/dashboard"}>
                    <Home/>
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            <NotificationButton initialState={{unreadCount: unreadNotificationCount}}/>

            {/* <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Messages" asChild>
                <Link href={"/messages"}>
                    <Home/>
                    <span className="hidden lg:inline">Messages</span>
                </Link>
            </Button> */}

            <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Bookmarks" asChild>
                <Link href={"/bookmarks"}>
                    <Bookmark/>
                    <span className="hidden lg:inline">Bookmarks</span>
                </Link>
            </Button>
        </div>
    )
}

export default memo(MenuBar)