import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'


import { MikroORM } from '@mikro-orm/core'
import { __port } from './constants'
import microConfig from './mikro-orm.config'
import { FooResolver } from './resolvers/FooResolver'
import { UserResolver } from './resolvers/UserResolver'
import { Foo } from './entities/Foo'
import { Post } from './entities/Post'
import { buildSchema } from 'type-graphql'

const main = async () => {
	const app = express()
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up() //run migrations first
  
  
	const post = orm.em.create(Post, { title: 'My name is Manan 🥳', updatedAt:new Date(), createdAt:new Date() }, {})
	const foo = orm.em.create(Foo, { title: 'My name is Manan 🥳', updatedAt:new Date(), createdAt:new Date() }, {})
	await orm.em.persistAndFlush(post)
	await orm.em.persistAndFlush(foo)

	const posts = await orm.em.find(Foo, {})
	console.clear()
	console.log(posts)


	//Middleware

	// create apollo server with express and type-graphql
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [FooResolver, UserResolver],
			emitSchemaFile: true,
			validate: false}),
		context: () => ({ em: orm.em })
	})

	// await apolloServer.start()
	apolloServer.applyMiddleware({ app })

	app.listen(__port, () => {
		console.log(`server started at http://localhost:${__port}/graphql`)
	}
	
	)
}

main().catch((err) => console.error(err))
