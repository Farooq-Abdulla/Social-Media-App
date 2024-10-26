import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { NotificationPage, notificationsInclude } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try {
        const cursor= req.nextUrl.searchParams.get("cursor")|| undefined
        const pageSize=10
        const session= await getServerSession()
        const user= session?.user
        if(!user){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }

        const notifications= await prisma.notification.findMany({
            where: {recipientId: user.id!},
            include: notificationsInclude,
            orderBy: {createdAt: 'desc'},
            take:pageSize+1,
            cursor : cursor? {id:cursor}: undefined
        })

        const nextCursor= notifications.length>pageSize ? notifications[pageSize].id :null

        const data:NotificationPage ={
            notifications:notifications.slice(0,pageSize),
            nextCursor: nextCursor
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}