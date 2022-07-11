import { IContext } from '../types'
import { Resolver, Query, Ctx, Int, Arg, Mutation } from 'type-graphql'
import { User } from '../entities/User'

@Resolver()
export class UserResolver {
  // GETALL
  @Query(() => [User])
	users(@Ctx() { em }: { em: IContext['em'] },
	):Promise<User[]> {
		return em.find(User, {})
	}

    // GETONE
    @Query(() => User)
  user(
        @Arg('name', () => Int) name: string,
        @Ctx() { em }: { em: IContext['em']},
  ):Promise<User | null> {
    	return em.findOne(User, { name })
  }

    // CREATE
    @Mutation(() => User)
    async createUser(
        @Arg('name') name: string,
        @Arg('password') password: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<User | null> {
    	const user = em.create(User, { name, password,createdAt: new Date() })
    	await em.persistAndFlush(user)
    	return user
    }

    // UPDATE
    @Mutation(() => User)
    async updateUser(
        @Arg('name', () => String) name: string,
        @Arg('password') password: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<User | null> {
    	const user = await em.findOne(User, { name })
    	if (!user) {
    		return null
    	}
    	user.password = password
    	await em.persistAndFlush(User)
    	return user
    }

    // DELETE
    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('name', () => Int) name: string,
        @Arg('password', () => String) password: string,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<boolean> {
    	const user = await em.findOne(User, { name, password })
    	if (!user) {
    		return false
    	}
    	await em.removeAndFlush(user)
    	return true
    }

    @Query(() => String)
    foobar() {
    	return 'Hello Manan!'
    }
}
