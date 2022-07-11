import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import { __password,  __user, __db } from './constants'
import { Foo } from './entities/Foo'
import { User } from './entities/Foo'

export default {
	migrations: {
		path: path.join(__dirname, 'migrations'),
		pattern: /^[\w-]+\d+\.[t]s$/,
	},
	allowGlobalContext: true,
	type: 'postgresql',
	user: __user,
	password: __password,
	dbName: __db,
	entities: [Foo, User],
	debug: true, // return all queries in console in dev
} as Parameters<typeof MikroORM.init>[0]
