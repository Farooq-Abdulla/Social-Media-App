"use server"

import getServerSession from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { z } from "zod";

const requiredString=z.string().trim().min(1, "required")
const createPostSchema= z.object({
    content:requiredString
})

export async function submitPost(input :string) {
    const session=await getServerSession()
    const user=session?.user
    if(!user) throw Error("Unauthorized")

    const {content}= createPostSchema.parse({content:input})

    const newPost=await prisma.post.create({
        data:{
            content,
            userId:user.id!
        },
        include:postDataInclude
    })
    return newPost

}