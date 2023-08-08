import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { ObjectType, CompositeType } from "deta/dist/types/types/basic";
import { z } from "zod";
import {
  FetchOptions,
  InsertOptions,
  PutManyOptions,
  PutOptions,
  UpdateOptions,
} from "deta/dist/types/types/base/request";
import {
  FetchResponse,
  GetResponse,
  InsertResponse,
  PutManyResponse,
  PutResponse,
  RecordType,
  Updates,
} from "./types";

export class BaseSafeClass<T extends RecordType> extends BaseClassSDK {
  protected manySchema: z.ZodArray<z.ZodType<T>>;

  constructor(
    key: string,
    type: KeyType,
    projectId: string,
    baseName: string,
    public readonly schema: z.ZodType<T>,
    protected readonly validation: boolean,
    host?: string
  ) {
    super(key, type, projectId, baseName, host);
    this.manySchema = z.array(this.schema);
  }

  put(data: T, key?: string, options?: PutOptions) {
    this.parse(data);
    return super.put(data, key, options) as Promise<PutResponse<T>>;
  }

  get(key: string) {
    return super.get(key) as Promise<GetResponse<T>>;
  }

  insert(data: T, key?: string, options?: InsertOptions) {
    this.parse(data);
    return super.insert(data, key, options) as Promise<InsertResponse<T>>;
  }

  putMany(items: T[], options?: PutManyOptions) {
    this.parse(...items);
    return super.putMany(items, options) as Promise<PutManyResponse<T>>;
  }

  update(updates: Updates<T>, key: string, options?: UpdateOptions) {
    return super.update(updates, key, options);
  } /** TODO: Add type to "update" parameter */

  fetch(query?: CompositeType, options?: FetchOptions) {
    return super.fetch(query, options) as Promise<FetchResponse<T>>;
  } /** TODO: Add type to "update" parameter
        TODO: Add "target" option to FetchOptions */

  protected parse(...data: unknown[]) {
    this.manySchema.parse(data);
  }
} /** TODO: Add JSDoc documentation */
