import { InputType, Field } from "type-graphql";
@InputType()
export class UserPswdInput {
  @Field()
  email!: string;
  @Field()
  name!: string;
  @Field()
  password!: string;
}
