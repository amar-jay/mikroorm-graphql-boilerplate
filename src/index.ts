import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import session from "express-session"
import connectRedis from "connect-redis"
import { buildSchema } from 'type-graphql'

import { __port } from './constants'
import { FooResolver } from './resolvers/FooResolver'
import { UserResolver } from './resolvers/UserResolver'
import { Foo } from './entities/Foo'


const main = async () => {
	const app = express()
	// const orm = await MikroORM.init(microConfig)
	// await orm.getMigrator().up() //run migrations first
	const orm = {em : {find : (_: unknown, {}) => {}, findOne : (_: unknown) => {}, }}
  
	// const post = orm.em.create(Post, { title: 'My name is Manan 🥳', updatedAt:new Date(), createdAt:new Date() }, {})
	// const foo = orm.em.create(Foo, { title: 'My name is Manan 🥳', updatedAt:new Date(), createdAt:new Date() }, {})
	// await orm.em.persistAndFlush(post)
	// await orm.em.persistAndFlush(foo)

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

	await apolloServer.start()
	apolloServer.applyMiddleware({ app })
	
let RedisStore = connectRedis(session)

// redis@v4
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
)

	app.listen(__port, () => {
		console.log(`server started at http://localhost:${__port}/graphql`)
	}
	
	)
}

main().catch((err) => console.error(err))

