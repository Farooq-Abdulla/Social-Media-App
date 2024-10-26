import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req:NextRequest){
    try {
        const session= await getServerSession()
        const user= session?.user
        if(!user){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }

        await prisma.notification.updateMany({
            where: {
                recipientId: user.id!,
                read: false,
            },
            data: {
                read: true
            }
        })

        return new NextResponse()

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}