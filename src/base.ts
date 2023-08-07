import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { ObjectType, NullType, DetaType } from "deta/dist/types/types/basic";
import { z } from "zod";
import { InsertOptions, PutOptions } from "deta/dist/types/types/base/request";

export type GetResponse<T extends ObjectType> = T | NullType;

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
    return super.put(data, key, options);
  }

  get(key: string) {
    return super.get(key) as Promise<GetResponse<T>>;
  }

  insert(data: T, key?: string, options?: InsertOptions) {
    return super.insert(data, key, options);
  }
}
