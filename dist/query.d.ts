import { ArrayType, RecordType } from "./types";
export type Query<T extends RecordType> = {
    [K in keyof T]?: T[K];
} & {
    [K in keyof T as T[K] extends number ? `${K & string}?gt` : never]?: number;
} & {
    [K in keyof T as T[K] extends number ? `${K & string}?lt` : never]?: number;
} & {
    [K in keyof T as T[K] extends number ? `${K & string}?gte` : never]?: number;
} & {
    [K in keyof T as T[K] extends number ? `${K & string}?lte` : never]?: number;
} & {
    [K in keyof T as T[K] extends string ? `${K & string}?pfx` : never]?: string;
} & {
    [K in keyof T as T[K] extends number ? `${K & string}?r` : never]?: [
        number,
        number
    ];
} & {
    [K in keyof T as T[K] extends string ? `${K & string}?contains` : never]?: string;
} & {
    [K in keyof T as T[K] extends string ? `${K & string}?not_contains` : never]?: string;
} & {
    [K in keyof T as T[K] extends ArrayType ? `${K & string}?contains` : never]?: T[K] extends Array<infer U> ? U : never;
} & {
    [K in keyof T as T[K] extends ArrayType ? `${K & string}?not_contains` : never]?: T[K] extends Array<infer U> ? U : never;
};
