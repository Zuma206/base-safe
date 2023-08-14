/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */

import { Deta as DetaSDK } from "deta";
import type DetaClassSDK from "deta/dist/types/deta";
import { z } from "zod";
import { RecordType } from "./types";
import { SchemaBaseClass } from "./base";

class DetaClass {
  constructor(protected deta: DetaClassSDK) {}

  Base(baseName: string, host?: string) {
    return this.deta.Base(baseName, host);
  }

  Drive(driveName: string, host?: string) {
    return this.deta.Drive(driveName, host);
  }

  SchemaBase<T extends RecordType>(
    baseName: string,
    schema: z.ZodType<T>,
    validation = true,
    host?: string
  ) {
    return new SchemaBaseClass(
      this.deta.Base(baseName, host),
      schema,
      validation
    );
  }
}

export function Deta(projectKey?: string, authToken?: string) {
  return new DetaClass(DetaSDK(projectKey, authToken));
}

export { z };
