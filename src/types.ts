/*eslint-disable  @typescript-eslint/no-explicit-any */
import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core'

export default interface Context {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}
