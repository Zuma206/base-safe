import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { ObjectType, NullType } from "deta/dist/types/types/basic";
import { z } from "zod";
import {
  InsertOptions,
  PutManyOptions,
  PutOptions,
} from "deta/dist/types/types/base/request";

export type GetResponse<T extends ObjectType> = T | NullType;
export type PutResponse<T extends ObjectType> = T | NullType;
export type InsertResponse<T extends ObjectType> = T;
export type PutManyResponse<T extends ObjectType> = {
  processed: {
    items: T[];
  };
};

export class BaseSafeClass<T extends ObjectType> extends BaseClassSDK {
  constructor(
    key: string,
    type: KeyType,
    projectId: string,
    baseName: string,
    public readonly schema: z.ZodType<T>,
    host?: string
  ) {
    super(key, type, projectId, baseName, host);
  }

  put(data: T, key?: string, options?: PutOptions) {
    return super.put(data, key, options) as Promise<PutResponse<T>>;
  }

  get(key: string) {
    return super.get(key) as Promise<GetResponse<T>>;
  }

  insert(data: T, key?: string, options?: InsertOptions) {
    return super.insert(data, key, options) as Promise<InsertResponse<T>>;
  }

  putMany(items: T[], options?: PutManyOptions) {
    return super.putMany(items, options) as Promise<PutManyResponse<T>>;
  }
}
