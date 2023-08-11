import type BaseClassSDK from "deta/dist/types/base";
import { z } from "zod";
import type {
  InsertOptions,
  PutManyOptions,
  PutOptions,
  UpdateOptions,
} from "deta/dist/types/types/base/request";
import type {
  AnyType,
  FetchOptions,
  FetchResponse,
  GetResponse,
  InsertResponse,
  PutManyResponse,
  PutResponse,
  RecordType,
  Updates,
} from "./types";
import { Action, ActionTypes } from "./action";
import { Query } from "./query";

export class SchemaBaseClass<T extends RecordType> {
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
    updates = Object.fromEntries(
      Object.entries(updates).map(([key, value]) => {
        if (value instanceof Action) {
          switch (value.operation) {
            case ActionTypes.Append:
              return [key, this.base.util.append(value.value as any)];
            case ActionTypes.Increment:
              return [key, this.base.util.increment(value.value as any)];
            case ActionTypes.Prepend:
              return [key, this.base.util.prepend(value.value as any)];
            case ActionTypes.Trim:
              return [key, this.base.util.trim()];
          }
        }
        return [key, value];
      })
    ) as any;

    return this.base.update(updates, key, options);
  }

  async fetch(query?: Query<T>, options?: FetchOptions) {
    const limit = options?.limit ?? Infinity;
    const response = await this.base.fetch(query as any, options);
    while (options?.fetchUntilLimit && response.count < limit) {
      const nextResponse = await this.base.fetch(query as any, {
        limit: limit - response.count,
        last: response.last,
        desc: options?.desc,
      });
      response.last = nextResponse.last;
      response.items.push(...nextResponse.items);
      response.count += nextResponse.count;
    }
    return response as FetchResponse<T>;
  }

  delete(key: string) {
    return this.base.delete(key);
  }

  protected parse(...data: unknown[]) {
    if (this.validation) {
      this.manySchema.parse(data);
    }
    this.base.util;
  }

  util = {
    trim() {
      return new Action(ActionTypes.Trim, undefined);
    },
    increment<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Increment, value);
    },
    append<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Append, value);
    },
    prepend<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Prepend, value);
    },
  };
} /** TODO: Add JSDoc documentation */
