import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "(~/)/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user:User) => {

    return{
        id: user.id, name: user.username, profilePicture: user.profileImageUrl
    }

}

export const postRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({  ctx }) => {
    const post = await  ctx.prisma.post.findMany(
        {
            take: 100,
            orderBy:[
                {
                    createdAt: 'desc'
                }
            ]
        }
    );
    const users = (
        await clerkClient.users.getUserList(
        {
            userId: post.map((p) => p.autherId),
            limit:100
        }
    )).map(filterUserForClient);
    console.log(users)
    return post.map((post) => {

        const auther = users.find((user) => user.id === post.autherId)
        if(!auther) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Author for the Post not found'})
        return {
        post,
        auther: {
            ...auther,
            name : auther.name
        },
        };
    })
  }),

    create: privateProcedure.input(z.object({
        content: z.string().emoji().min(1).max(280),
    })).mutation(async ({ ctx,input }) => {
        const autherId = ctx.currentUser;

        const post = await ctx.prisma.post.create({
            data: {
                autherId,
                content: input.content,

            },
        });

        return post;
    }),
});
