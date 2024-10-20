"use server";

import getServerSession from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validations";

export async function updateUserProfile(values:UpdateUserProfileValues) {
    const validedValues= updateUserProfileSchema.parse(values);
    const session= await getServerSession()
    const user= session?.user
    if(!user) throw new Error("Unauthorized");

    const updateUser= await prisma.user.update({
        where:{id: user.id},
        data: validedValues,
        select: getUserDataSelect(user.id!)
    });

    return updateUser
}