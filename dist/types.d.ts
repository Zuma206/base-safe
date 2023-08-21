import { FetchOptions as FetchOptionsSDK } from "deta/dist/types/types/base/request";
import { Action, ActionTypes } from "./action";
import { BasicType, NullType, UndefinedType } from "deta/dist/types/types/basic";
export type GetResponse<T extends RecordType> = OutputRecord<T> | NullType;
export type PutResponse<T extends RecordType> = OutputRecord<T> | NullType;
export type InsertResponse<T extends RecordType> = OutputRecord<T>;
export type PutManyResponse<T extends RecordType> = {
    processed: {
        items: OutputRecord<T>[];
    };
};
export type FetchResponse<T extends RecordType> = {
    items: OutputRecord<T>[];
    count: number;
    last?: string;
};
export type ArrayType = Array<BasicType | NullType | RecordType | UndefinedType | ArrayType>;
export type RecordType = {
    [key: string]: BasicType | NullType | RecordType | UndefinedType | ArrayType;
    __expires?: never;
    key?: never;
};
export type OutputRecord<T extends RecordType> = T & {
    key: string;
    __expires?: number;
};
export type AnyType = RecordType | RecordType[keyof RecordType];
export type ActionsForType<T extends AnyType> = T extends number ? ActionTypes.Increment : never | T extends ArrayType ? ActionTypes.Append | ActionTypes.Prepend : never | T extends undefined ? ActionTypes.Trim : never;
export type ActionValue<T extends AnyType, A extends ActionsForType<T>> = A extends ActionTypes.Trim ? undefined : T extends Array<infer U> ? A extends ActionTypes.Append | ActionTypes.Prepend ? T | U : T : T;
export type Updates<T extends RecordType, Prefix extends string = ""> = T extends object ? {
    [K in keyof T]: T[K] extends RecordType ? Updates<T[K], `${Prefix}${K & string}.`> : {
        [P in `${Prefix}${K & string}`]: T[K] | Action<T[K], ActionsForType<T[K]>, ActionValue<T[K], ActionsForType<T[K]>>>;
    };
}[keyof T] : T;
export type FetchOptions = FetchOptionsSDK & {
    autoPaginate?: boolean;
};
