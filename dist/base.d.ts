import type BaseClassSDK from "deta/dist/types/base";
import { z } from "zod";
import type { InsertOptions, PutManyOptions, PutOptions, UpdateOptions } from "deta/dist/types/types/base/request";
import type { AnyType, FetchOptions, FetchResponse, PutManyResponse, RecordType, Updates } from "./types";
import { Action, ActionTypes } from "./action";
import { Query } from "./query";
export declare class SchemaBaseClass<T extends RecordType> {
    protected base: BaseClassSDK;
    readonly schema: z.ZodType<T>;
    protected validation: boolean;
    protected manySchema: z.ZodArray<z.ZodType<T>>;
    constructor(base: BaseClassSDK, schema: z.ZodType<T>, validation?: boolean);
    /**
     * put is the fastest way to store an item in a Base. If an item already exists under the given key, it will be replaced. In the case you do not provide a key, Base will automatically generate a 12-character string as a key.
     * @param data The data to be stored.
     * @param key The key to store the data under. Will be auto generated if not provided.
     * @param options Optional parameters.
     * @returns Returns a promise which resolves to a PutResponse containing the item. If the operation did not complete successfully, throws an Error.
     */
    put(data: T, key?: string, options?: PutOptions): Promise<null>;
    /**
     * Retrieves an item by its key.
     * @param key The key of the item to retrieve.
     * @returns Returns a promise which resolves to a GetResponse. If the item is found, the response will contain the item. If not found, the response will be null.
     */
    get(key: string): Promise<null>;
    /**
     * Inserts a single item, but is different from put in that it will throw an error of the key already exists in the Base.
     * @param data The data to be stored.
     * @param key The key to store the data under. Will be auto generated if not provided.
     * @param options Optional parameters.
     * @returns Returns a promise which resolves to an InsertResponse containing the item. If the operation did not complete successfully, or the key already exists, throws an Error.
     */
    insert(data: T, key?: string, options?: InsertOptions): Promise<never>;
    /**
     * Puts up to 25 items at once with a single call.
     * @param items The list of items to be stored.
     * @param options Optional parameters.
     * @returns Returns a promise which resolves to a PutManyResponse containing the items. If the operation did not complete successfully, or items contains more than 25 items, throws an Error.
     */
    putMany(items: T[], options?: PutManyOptions): Promise<PutManyResponse<T>>;
    /**
     * Updates an existing item.
     * @param updates An object describing the updates on the item.
     * @param key The key of the item to be updated.
     * @param options Optional parameters.
     * @returns A promise which resolves to null
     */
    update(updates: Updates<T>, key: string, options?: UpdateOptions): Promise<null>;
    /**
     * Retrieves a list of items matching a query. It will retrieve everything if no query is provided, up to a limit of 1 MB or 1000 items.
  
  A query is composed of a single query object or a list of query objects. In the case of a list, the indvidual queries are OR’ed.
     * @param query The query to filter the items by.
     * @param options Optional parameters.
     * @returns
     */
    fetch(query?: Query<T>, options?: FetchOptions): Promise<FetchResponse<T>>;
    /**
     * Deletes an item by its key.
     * @param key The key of the item to delete.
     * @returns Returns a promise which resolves to a DeleteResponse. The response will always be null, even if the key does not exist.
     */
    delete(key: string): Promise<null>;
    protected parse(...data: unknown[]): void;
    /**
     * The util attribute of a Base instance is an instance of the Util class. It provides utility methods for use in update operations.
     */
    util: {
        /**
         * Removes an attribute from the item.
         * @returns
         */
        trim(): Action<AnyType, ActionTypes.Trim, undefined>;
        /**
         * Increments the value of an attribute. The provided value can be any positive or negative integer. The attribute’s value must be a number. The default value is 1.
         * @param value
         * @returns
         */
        increment<T_1 extends AnyType>(value: T_1): Action<AnyType, ActionTypes.Increment, T_1>;
        /**
         * Appends to a list. The value can be a primitive type or a array / list.
         * @param value
         * @returns
         */
        append<T_2 extends AnyType>(value: T_2): Action<AnyType, ActionTypes.Append, T_2>;
        /**
         * Prepends to a list. The value can be a primitive type or an array / list.
         * @param value
         * @returns
         */
        prepend<T_3 extends AnyType>(value: T_3): Action<AnyType, ActionTypes.Prepend, T_3>;
    };
} /** TODO: Add JSDoc documentation */
