import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { NotificationCountInfo } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try {
        const session= await getServerSession()
        const user= session?.user
        if(!user){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }

        const unreadCount= await prisma.notification.count({
            where: {
                recipientId: user.id!,
                read: false
            },
        })

        const data:NotificationCountInfo={
            unreadCount,
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}