import type BaseClassSDK from "deta/dist/types/base";
import type { CompositeType } from "deta/dist/types/types/basic";
import { z } from "zod";
import type {
  FetchOptions,
  InsertOptions,
  PutManyOptions,
  PutOptions,
  UpdateOptions,
} from "deta/dist/types/types/base/request";
import type {
  FetchResponse,
  GetResponse,
  InsertResponse,
  PutManyResponse,
  PutResponse,
  RecordType,
  Updates,
} from "./types";

export class BaseSafeClass<T extends RecordType> {
  protected manySchema: z.ZodArray<z.ZodType<T>>;

  constructor(
    protected base: BaseClassSDK,
    public readonly schema: z.ZodType<T>,
    protected validation: boolean = true
  ) {
    this.manySchema = z.array(schema);
  }

  put(data: T, key?: string, options?: PutOptions) {
    this.parse(data);
    return this.base.put(data, key, options) as Promise<PutResponse<T>>;
  }

  get(key: string) {
    return this.base.get(key) as Promise<GetResponse<T>>;
  }

  insert(data: T, key?: string, options?: InsertOptions) {
    this.parse(data);
    return this.base.insert(data, key, options) as Promise<InsertResponse<T>>;
  }

  putMany(items: T[], options?: PutManyOptions) {
    this.parse(...items);
    return this.base.putMany(items, options) as Promise<PutManyResponse<T>>;
  }

  update(updates: Updates<T>, key: string, options?: UpdateOptions) {
    return this.base.update(updates, key, options);
  }

  fetch(query?: CompositeType, options?: FetchOptions) {
    return this.base.fetch(query, options) as Promise<FetchResponse<T>>;
  } /** TODO: Add type to "query" parameter
        TODO: Add "target" option to FetchOptions */

  protected parse(...data: unknown[]) {
    if (this.validation) {
      this.manySchema.parse(data);
    }
  }
} /** TODO: Add JSDoc documentation */
