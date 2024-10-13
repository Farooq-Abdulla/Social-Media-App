import getServerSession from "@/lib/get-server-session"
import { prisma } from "@/lib/prisma"
import { postDataInclude, PostsPage } from "@/lib/types"
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
        const posts = await prisma.post.findMany({
            orderBy:{createdAt:"desc"},
            include:postDataInclude,
            take:pageSize+1,
            cursor : cursor? {id:cursor}: undefined
        })

        const nextCursor= posts.length>pageSize ? posts[pageSize].id :null

        const data:PostsPage ={
            posts:posts.slice(0,10),
            nextCursor: nextCursor
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}