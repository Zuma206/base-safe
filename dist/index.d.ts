/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */
import type DetaClassSDK from "deta/dist/types/deta";
import { z } from "zod";
import { RecordType } from "./types";
import { SchemaBaseClass } from "./base";
declare class DetaClass {
    protected deta: DetaClassSDK;
    constructor(deta: DetaClassSDK);
    Base(baseName: string, host?: string): import("deta/dist/types/base").default;
    Drive(driveName: string, host?: string): import("deta/dist/types/drive").default;
    SchemaBase<T extends RecordType>(baseName: string, schema: z.ZodType<T>, validation?: boolean, host?: string): SchemaBaseClass<T>;
}
export declare function Deta(projectKey?: string, authToken?: string): DetaClass;
export { z };
