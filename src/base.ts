import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { ObjectType } from "deta/dist/types/types/basic";
import { z } from "zod";

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
}
