/* eslint-disable no-mixed-spaces-and-tabs */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  	id!: number

  @Field(() => String)
  @Property({ type: 'date', default: 'NOW()' })
  	createdAt: Date = new Date()
  
  @Field(() => String)
  @Property({ onUpdate: () => new Date(), default: 'NOW()' })
  	updatedAt: Date = new Date()

  @Field()
  @Property({ type: 'text' })
  	title!: string
    
}
