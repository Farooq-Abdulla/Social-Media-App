import { cn } from "@/lib/utils"
import Image from "next/image"
import { memo } from "react"


interface UserAvatarProps {
    avatarUrl: string | null
    size?: number
    className?: string
}
function UserAvatar({ avatarUrl, size, className }: UserAvatarProps) {
    return (
        <Image src={avatarUrl || '/avatarPlaceholder.png'} alt="User Avatar" width={size ?? 48} height={size ?? 48} className={cn("aspect-square h-fit flex-none rounded-full bg-secondary object-cover", className)} />
    )
}

export default memo(UserAvatar);