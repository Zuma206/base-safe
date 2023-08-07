import { NullType, ObjectType } from "deta/dist/types/types/basic";

export type GetResponse<T extends ObjectType> = T | NullType;
export type PutResponse<T extends ObjectType> = T | NullType;
export type InsertResponse<T extends ObjectType> = T;
export type PutManyResponse<T extends ObjectType> = {
  processed: {
    items: T[];
  };
};
export type FetchResponse<T extends ObjectType> = {
  items: T[];
  count: number;
  last?: string;
};
