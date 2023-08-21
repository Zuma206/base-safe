import { ArrayType, RecordType } from "./types";

type QueryType<T extends RecordType, P extends string = ""> = {
  [K in keyof T as `${P}${K & string}`]?: T[K];
} & {
  [K in keyof T as T[K] extends number
    ? `${P}${K & string}?gt`
    : never]?: number;
} & {
  [K in keyof T as T[K] extends number
    ? `${P}${K & string}?lt`
    : never]?: number;
} & {
  [K in keyof T as T[K] extends number
    ? `${P}${K & string}?gte`
    : never]?: number;
} & {
  [K in keyof T as T[K] extends number
    ? `${P}${K & string}?lte`
    : never]?: number;
} & {
  [K in keyof T as T[K] extends string
    ? `${P}${K & string}?pfx`
    : never]?: string;
} & {
  [K in keyof T as T[K] extends number ? `${P}${K & string}?r` : never]?: [
    number,
    number
  ];
} & {
  [K in keyof T as T[K] extends string
    ? `${P}${K & string}?contains`
    : never]?: string;
} & {
  [K in keyof T as T[K] extends string
    ? `${P}${K & string}?not_contains`
    : never]?: string;
} & {
  [K in keyof T as T[K] extends ArrayType
    ? `${P}${K & string}?contains`
    : never]?: T[K] extends Array<infer U> ? U : never;
} & {
  [K in keyof T as T[K] extends ArrayType
    ? `${P}${K & string}?not_contains`
    : never]?: T[K] extends Array<infer U> ? U : never;
};

export type Query<
  T extends RecordType,
  Prefix extends string = ""
> = T extends object
  ? {
      [K in keyof T]: T[K] extends RecordType
        ? Query<T[K], `${Prefix}${K & string}.`>
        : QueryType<T, Prefix>;
    }[keyof T]
  : T;
