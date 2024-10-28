'use client'

import useFollowingInfo from "@/hooks/use-following"
import { FollowingInfo } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface FollowerCountProps {
    userId: string,
    initialState: FollowingInfo
}

export default function FollowingCount({ userId, initialState }: FollowerCountProps) {
    const { data } = useFollowingInfo(userId, initialState)

    return (
        <span>
            Following :{" "}
            <span className="font-semibold"> {formatNumber(data.following)}</span>
        </span>
    )
}