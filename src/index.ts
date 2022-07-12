import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import { buildSchema } from "type-graphql";
import { createClient } from "redis";

import { __port, __prod, __sessions_secret } from "./constants";
import { FooResolver } from "./resolvers/FooResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/PostResolver";
import cors from "cors";

const main = async () => {
  const app = express();
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up(); //run migrations first

  //Sessions
  const RedisStore = connectRedis(session);

  let redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use(cors());
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 10, // 10 weeks
        httpOnly: true,
        sameSite: "lax", // csrf protection
        secure: __prod,
      },

      secret: __sessions_secret,
      resave: false,
    })
  );

  //Middleware

  // apollo server with express and type-graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [FooResolver, UserResolver, PostResolver],
      emitSchemaFile: true,
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Start the server
  app.listen(__port, () => {
    console.log(`server started at http://localhost:${__port}/graphql`);
  });
};

main().catch((err) => console.error(err));
