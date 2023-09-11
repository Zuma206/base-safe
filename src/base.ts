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
  FormDataInput,
  GetResponse,
  InsertResponse,
  PutManyResponse,
  PutResponse,
  RecordType,
  Updates,
} from "./types";
import { Action, ActionTypes } from "./action";
import { Query } from "./query";

/**
 * The Base class provides methods to interact with a Deta Base. If you have not yet instantiated the Deta Object, you must do so before you can use the Base Class. This "Typed" version of the class takes a generic and a schema which are used to type-safe the class.
 */
export class TypedBase<T extends RecordType> {
  protected manySchema: z.ZodArray<z.ZodType<T>>;

  constructor(
    protected base: BaseClassSDK,
    public readonly schema: z.ZodType<T>,
    protected validation: boolean = true
  ) {
    this.manySchema = z.array(schema);
  }

  /**
   * put is the fastest way to store an item in a Base. If an item already exists under the given key, it will be replaced. In the case you do not provide a key, Base will automatically generate a 12-character string as a key.
   * @param data The data to be stored.
   * @param key The key to store the data under. Will be auto generated if not provided.
   * @param options Optional parameters.
   * @returns Returns a promise which resolves to a PutResponse containing the item. If the operation did not complete successfully, throws an Error.
   */
  put(data: T, key?: string, options?: PutOptions) {
    this.parse(data);
    return this.base.put(data, key, options) as Promise<PutResponse<T>>;
  }

  /**
   * Retrieves an item by its key.
   * @param key The key of the item to retrieve.
   * @returns Returns a promise which resolves to a GetResponse. If the item is found, the response will contain the item. If not found, the response will be null.
   */
  get(key: string) {
    return this.base.get(key) as Promise<GetResponse<T>>;
  }

  /**
   * Inserts a single item, but is different from put in that it will throw an error of the key already exists in the Base.
   * @param data The data to be stored.
   * @param key The key to store the data under. Will be auto generated if not provided.
   * @param options Optional parameters.
   * @returns Returns a promise which resolves to an InsertResponse containing the item. If the operation did not complete successfully, or the key already exists, throws an Error.
   */
  insert(data: T, key?: string, options?: InsertOptions) {
    this.parse(data);
    return this.base.insert(data, key, options) as Promise<InsertResponse<T>>;
  }

  // protected splitIntoChunks(items: T[], chunkSize = 25) {
  //   const chunks: T[][] = [];
  //   for (let i = 0; i < items.length; i += chunkSize) {
  //     chunks.push(items.slice(i, i + chunkSize));
  //   }
  //   return chunks;
  // }

  /**
   * Puts up to 25 items at once with a single call.
   * @param items The list of items to be stored.
   * @param options Optional parameters.
   * @returns Returns a promise which resolves to a PutManyResponse containing the items. If the operation did not complete successfully, or items contains more than 25 items, throws an Error.
   */
  async putMany(items: T[], options?: PutManyOptions) {
    this.parse(...items);

    // if (options?.autoPaginate && items.length > 25) {
    //   const response: PutManyResponse<T> = { processed: { items: [] } };
    //   const chunks = this.splitIntoChunks(items);
    //   const promises = chunks.map((chunk) => this.base.putMany(chunk, options));
    //   const results = await Promise.allSettled(promises);

    //   for (let i = 0; i < results.length; i++) {
    //     const result = results[i];
    //     if (result.status == "rejected") continue;
    //     const { items } = result.value.processed as any;
    //     response.processed.items.push(...items);
    //   }

    //   return response;
    // }

    return (await this.base.putMany(items, options)) as PutManyResponse<T>;
  }

  /**
   * Updates an existing item.
   * @param updates An object describing the updates on the item.
   * @param key The key of the item to be updated.
   * @param options Optional parameters.
   * @returns A promise which resolves to null
   */
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

  /**
   * Retrieves a list of items matching a query. It will retrieve everything if no query is provided, up to a limit of 1 MB or 1000 items.

A query is composed of a single query object or a list of query objects. In the case of a list, the indvidual queries are OR’ed.
   * @param query The query to filter the items by.
   * @param options Optional parameters.
   * @returns 
   */
  async fetch(query?: Query<T> | Query<T>[], options?: FetchOptions) {
    const limit = options?.limit ?? Infinity;
    const response = await this.base.fetch(query as any, options);
    while (options?.autoPaginate && response.count < limit && response.last) {
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

  /**
   * Deletes an item by its key.
   * @param key The key of the item to delete.
   * @returns Returns a promise which resolves to a DeleteResponse. The response will always be null, even if the key does not exist.
   */
  delete(key: string) {
    return this.base.delete(key);
  }

  // async deleteManyPaginate(keys: string[]) {
  //   await Promise.all(keys.map((key) => this.base.delete(key)));
  //   return null;
  // }

  protected parse(...data: unknown[]) {
    if (this.validation) {
      this.manySchema.parse(data);
    }
    this.base.util;
  }

  /**
   * The util attribute of a Base instance is an instance of the Util class. It provides utility methods for use in update operations.
   */
  util = {
    /**
     * Removes an attribute from the item.
     * @returns
     */
    trim() {
      return new Action(ActionTypes.Trim, undefined);
    },

    /**
     * Increments the value of an attribute. The provided value can be any positive or negative integer. The attribute’s value must be a number. The default value is 1.
     * @param value
     * @returns
     */
    increment<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Increment, value);
    },

    /**
     * Appends to a list. The value can be a primitive type or a array / list.
     * @param value
     * @returns
     */
    append<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Append, value);
    },

    /**
     * Prepends to a list. The value can be a primitive type or an array / list.
     * @param value
     * @returns
     */
    prepend<T extends AnyType>(value: T) {
      return new Action(ActionTypes.Prepend, value);
    },
  };

  /**
   * Will parse form data into a record that can be inserted into the base. Will error if the formData cannot be parsed.
   * @param formData The form data recieved when submitted
   * @returns A record that's ready to be inserted into the base
   * @deprecated Deprecated since 0.4.0, use the methods on the `form` object instead
   */
  parseForm(formData: FormDataInput<T>) {
    return this.schema.parse(
      Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ])
      )
    );
  }

  protected prepareFormData(formData: Partial<FormDataInput<T>>) {
    return Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );
  }

  /**
   * Methods used for parsing form data, for use in senarios such as NextJS server actions
   */
  form = {
    /**
     * Converts data from a FormData object into a record
     * @param formData An object that maps the data from a form to values in the record type
     * @returns A type-safe record ready to be put into the base
     */
    parseInput: (formData: FormDataInput<T>) =>
      this.schema.parse(this.prepareFormData(formData)),

    /**
     * COnverts data from a FormData object into an update
     * @param formData An object that maps the data from a form to values to be updated
     * @returns A type-safe update ready to be executed
     */
    parseUpdate: (formData: Partial<FormDataInput<T>>) =>
      (this.schema as unknown as z.ZodObject<{}>)
        .partial()
        .parse(formData) as T,
  };
}
