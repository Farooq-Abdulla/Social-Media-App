"use server"

import getServerSession from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
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

    await prisma.post.create({
        data:{
            content,
            userId:user.id!
        }
    })

}