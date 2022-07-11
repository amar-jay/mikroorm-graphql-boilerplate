import { MikroORM } from '@mikro-orm/core'
import { __password,  __user, __db } from './constants'
import { Foo } from './entities/Foo'
import { User } from './entities/User'

export default {
	migrations: {
		// pathT: undefined,
		path: './src/migrations',
		pattern: /^[\w-]+\d+.*\.js$/,
		glob: '!(*.d).{js,ts}',
		emit: 'ts'
	},
	allowGlobalContext: true,
	type: 'postgresql',
	user: __user,
	password: __password,
	dbName: __db,
	entities: [Foo, User],
	debug: true, // return all queries in console in dev
} as Parameters<typeof MikroORM.init>[0]
