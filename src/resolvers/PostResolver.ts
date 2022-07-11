/* eslint-disable */
import { IContext } from '../types'
import {
	Resolver, Query, Ctx, Int, Arg, Mutation,
} from 'type-graphql'
import { Post } from '../entities/Post'

@Resolver()
export class PostResolver {
    // GETALL
    @Query(() => [Post])
	posts(
        @Ctx() { em }: { em: IContext['em'] },
	):Promise<Post[]> {
		return em.find(Post, {})
	}

    // GETONE
    @Query(() => Post)
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Post | null> {
    	return em.findOne(Post, { id })
    }

    // CREATE
    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Post | null> {
    	const post = em.create(Post, { title, createdAt: new Date(), updatedAt: new Date() })
    	await em.persistAndFlush(post)
    	return post
    }

    // UPDATE
    @Mutation(() => Post)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Post | null> {
    	const post = await em.findOne(Post, { id })
    	if (!post) {
    		return null
    	}
    	post.title = title
    	post.updatedAt = new Date()
    	await em.persistAndFlush(post)
    	return post
    }

    // DELETE
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<boolean> {
    	const post = await em.findOne(Post, { id })
    	if (!post) {
    		return false
    	}
    	await em.removeAndFlush(post)
    	return true
    }

    @Query(() => String)
    hello() {
    	return 'Hello Manan!'
    }
}
