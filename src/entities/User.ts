/* eslint-disable no-mixed-spaces-and-tabs */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'

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
  	email: string

  @Field()
  @Property({ type: 'text', unique: true })
  	name!: string

  @Property({ type: 'text', length: 100 })
  	password!: string
}
