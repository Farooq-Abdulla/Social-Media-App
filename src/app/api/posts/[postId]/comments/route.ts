import getServerSession from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
interface IPostIdProps {
    params: {
      postId: string;
    };
  }
  
export async function GET(req: NextRequest  ,{ params: { postId } }: IPostIdProps) {
    try {
        const cursor= req.nextUrl.searchParams.get("cursor")|| undefined
        const pageSize=5
        const session= await getServerSession()
        const user= session?.user
        if(!user){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        const comments = await prisma.comment.findMany({
            where:{postId},
            orderBy:{createdAt:"asc"},
            include:getCommentDataInclude(user.id!),
            take: -pageSize-1,
            cursor : cursor? {id:cursor}: undefined
        })

        const previousCursor= comments.length>pageSize ? comments[0].id :null

        const data:CommentsPage ={
            comments:comments.length>pageSize? comments.slice(1):comments,
            previousCursor: previousCursor
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:"Internal Server Error"}, {status:500})
    }
}