import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
// import { ObjectCriteriaNode } from "@mikro-orm/postgresql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  	id!: number

  @Field(() => String)
  @Property({ type: 'date', default: 'NOW()' })
  	createdAt: Date = new Date()

  @Field()
  @Property({ type: 'text', unique: true })
  	name: string

  @Property({ type: 'text', length: 100 })
  	password: string
}