import { MikroORM } from '@mikro-orm/core'
import { __password,  __user, __db } from './constants'
import { Foo } from './entities/Foo'
import { User } from './entities/User'
import { Post } from './entities/Post'

export default {
	migrations: {
		 pathTs: './src/migrations',
		path: './dist/migrations',
		pattern: /^[\w-]+\d+.*\.[t]s$/,
		glob: '!(*.d).{js,ts}',
		emit: 'ts'
	},
	allowGlobalContext: true,
	type: 'postgresql',
	user: __user,
	password: __password,
	dbName: __db,
	entities: [Foo, User, Post],
	debug: true, // return all queries in console in dev
} as Parameters<typeof MikroORM.init>[0]
