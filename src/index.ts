import 'reflect-metadata'
import express from 'express'
import { MikroORM } from '@mikro-orm/core'
import { __port } from './constants'
import microConfig from './mikro-orm.config'

import { Post } from './entities/Post'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'

const main = async () => {
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up() //run migrations first
  
	const post = orm.em.create(Post, { title: 'My name is Manan 🥳', updatedAt:new Date(), createdAt:new Date() }, {})
	await orm.em.persistAndFlush(post)

	const posts = await orm.em.find(Post, {})
	console.log(posts)

	const app = express()
	//Middleware

	// create apollo server with express and type-graphql
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [__dirname + '/**/*.resolver.[tj]s'],
			emitSchemaFile: true,
			validate: false}),
		context: () => ({ em: orm.em })
	})
	apolloServer.applyMiddleware({ app })

	app.listen(__port, () => {
		console.log(`server started at http://localhost:${__port}/graphql`)
	}
	)
}

main().catch((err) => console.error(err))
