import { IContext } from '../types'
import { Resolver, Query, Ctx, Int, Arg, Mutation, Field, ObjectType } from 'type-graphql'
import { User } from '../entities/User'
import { UserPswdInput } from './UserPswdInput'
import * as argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  
  @Field(() => User, { nullable: true })
  user?: User;
}

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
    async register(
        @Arg('options') options: UserPswdInput,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<UserResponse> {
      const { name, email, password } = options
      if (!(name.length < 3)) {
        return { errors: [{field: 'name', message: 'Name length is too short' }]}
      }
      if (email &&  !email.includes('@') ) {
        return { errors: [{field: 'email', message: 'Invalid Email' }]}
      }

      if (!(password.length < 7)) {
        return { errors: [{field: 'password', message: 'Password length is too short' }]}
      }

      const hashedPassword = await argon2.hash(password)
    	const user = em.create(User, { name, email, password: hashedPassword,createdAt: new Date() })
    	await em.persistAndFlush(user)
    	return {user}
    }

    @Mutation(() => User)
    async login(
        @Arg('options') options: UserPswdInput,
        @Ctx() { em }: { em: IContext['em']},
    ):Promise<UserResponse> {
      const { name, password} = options
      
    	const user = await em.findOne(User, { name })
      if (!user) {
        return { errors: [{field: 'name', message: 'User not found' }]}
      }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{field: "password", message: "incorrect password" }]};
    }

    return {
      user,
    };
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
