"use server"

import getServerSession from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validations";



export async function submitPost(input :{content: string, mediaIds: string[]}) {
    const session=await getServerSession()
    const user=session?.user
    if(!user) throw Error("Unauthorized")

    const {content, mediaIds}= createPostSchema.parse(input)  

    const newPost=await prisma.post.create({
        data:{
            content,
            userId:user.id!,
            attachments:{
                connect: mediaIds.map((id) => ({ id })),
            }
        },
        include:getPostDataInclude(user.id!)
    })
    return newPost

}