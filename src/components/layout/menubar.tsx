import { cn } from "@/lib/utils"
import { Bell, Bookmark, Home } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { Button } from "../ui/button"

function MenuBar({className}:{className?:  string}){
    return(
        <div className={cn("", className)}>
            <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Home" asChild>
                <Link href={"/"}>
                    <Home/>
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Notifications" asChild>
                <Link href={"/notifications"}>
                    <Bell/>
                    <span className="hidden lg:inline">Notifications</span>
                </Link>
            </Button>

            <Button variant={'ghost'} className="flex items-center justify-start gap-3" title="Messages" asChild>
                <Link href={"/messages"}>
                    <Home/>
                    <span className="hidden lg:inline">Messages</span>
                </Link>
            </Button>

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