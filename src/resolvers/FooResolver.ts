/* eslint-disable */
import { IContext } from '../types'
import {
	Resolver, Query, Ctx, Int, Arg, Mutation,
} from 'type-graphql'
import { Foo } from '../entities/Foo'

@Resolver()
export class FooResolver {
    // GETALL
    @Query(() => [Foo])
	foos(
        @Ctx() { em }: { em: IContext['em'] },
	):Promise<Foo[]> {
		return em.find(Foo, {})
	}

    // GETONE
    @Query(() => Foo)
    aFoo(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Foo | null> {
    	return em.findOne(Foo, { id })
    }

    // CREATE
    @Mutation(() => Foo)
    async makeFoo(
        @Arg('title') title: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Foo | null> {
    	const post = em.create(Foo, { title, createdAt: new Date(), updatedAt: new Date() })
    	await em.persistAndFlush(post)
    	return post
    }

    // UPDATE
    @Mutation(() => Foo)
    async changeFoo(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<Foo | null> {
    	const post = await em.findOne(Foo, { id })
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
    	const post = await em.findOne(Foo, { id })
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
