import { IContext } from "../types";
import {
  Resolver,
  Query,
  Ctx,
  Int,
  Arg,
  Mutation,
  Field,
  ObjectType,
} from "type-graphql";
import { User } from "../entities/User";
import { UserPswdInput } from "./UserPswdInput";
import * as argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
  @Field()
  value?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // GETALL
  @Query(() => UserResponse)
  users(
    @Ctx() { em, req }: IContext
  ): Promise<User[]> | { errors: FieldError[] } {
    let id = req.session.userId;
    if (id && id !== null) {
      em.findOne(User, { id }).catch(() => {
        req.session.userId = null;
        return {
          errors: [{ field: "check all users", message: "Users not Found" }],
        };
      });
      const users = em.find(User, {});
      return users;
    }

    return {
      errors: [
        { field: "check all users", message: "Users not Found" },
      ] as FieldError[],
    };
  }

  // CREATE
  @Mutation(() => UserResponse)
  async register(
    @Arg("name") name: string,
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Ctx() { em, req }: IContext
  ): Promise<UserResponse> {
    // const { name password, email } = {name, password, email};
    if (!name || !email || !password) {
      return {
        errors: [
          {
            field: "FieldsNotProvided",
            message: "Name,ff email and password are required",
          },
        ],
      };
    }

    if (name.length < 3) {
      return {
        errors: [{ field: "name", message: "Name length is too short" }],
      };
    }
    if (email && !email.includes("@")) {
      return { errors: [{ field: "email", message: "Invalid Email" }] };
    }

    if (password.length < 7) {
      return {
        errors: [
          { field: "password", message: "Password length is too short" },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      return {
        errors: [{ field: "ExistingUser", message: "User already exists" }],
      };
    }

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => User)
  async login(
    @Arg("options") options: UserPswdInput,
    @Ctx() { em, req }: IContext
  ): Promise<UserResponse> {
    const { name, password } = options;

    const user = await em.findOne(User, { name });
    if (!user!.id || !req?.session?.userId) {
      return { errors: [{ field: "id", message: "User not found by id" }] };
    }

    if (!user) {
      return { errors: [{ field: "name", message: "User not found" }] };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{ field: "password", message: "incorrect password" }] };
    }

    req.session.userId = user.id;
    return {
      user,
    };
  }
  // UPDATE
  @Mutation(() => User)
  async updateUser(
    @Arg("name", () => String) name: string,
    @Arg("password") password: string,
    @Ctx() { em }: IContext
  ): Promise<User | null> {
    const user = await em.findOne(User, { name });
    if (!user) {
      return null;
    }
    user.password = password;
    await em.persistAndFlush(User);
    return user;
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("options", () => Int) options: UserPswdInput,
    @Ctx() { em }: { em: IContext["em"] }
  ): Promise<UserResponse | boolean> {
    const user = await em.findOne(User, options);
    if (!user) {
      return { errors: [{ field: "name", message: "User not found" }] };
    }
    await em.removeAndFlush(user);
    return true;
  }

  @Query(() => User)
  async loggedIn(@Ctx() { em, req }: IContext): Promise<UserResponse> {
    if (!req.session.userId) {
      return {
        errors: [{ field: "LogInCheck", message: "No User is logged in" }],
      };
    }
    const user = await em.findOne(User, { id: req.session.userId })!;
    if (!user) {
      return {
        errors: [{ field: "logInCheck", message: "User not Found" }],
      };
    }
    return {
      user,
    };
  }
}
