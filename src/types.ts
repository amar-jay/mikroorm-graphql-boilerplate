/*eslint-disable  @typescript-eslint/no-explicit-any */
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export interface IContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: { userId: number | null };
  };
  res: Response;
}
