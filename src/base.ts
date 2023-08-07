import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { DetaType } from "deta/dist/types/types/basic";
import { z } from "zod";
import { PutOptions } from "deta/dist/types/types/base/request";

export class BaseSafeClass<T extends DetaType> extends BaseClassSDK {
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

  async put(data: T, key?: string, options?: PutOptions) {
    return await super.put(data, key, options);
  }
}
