import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
// import { ObjectCriteriaNode } from "@mikro-orm/postgresql";

@ObjectType()
@Entity()
export class Foo {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date", default: "NOW()" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), default: "NOW()" })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: "text" })
  title: string;
}
