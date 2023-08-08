/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */

import { Deta as DetaSDK } from "deta";
import type DetaClassSDK from "deta/dist/types/deta";
import type { z } from "zod";
import { RecordType } from "./types";
import { BaseSafeClass } from "./base";

class DetaClass {
  constructor(protected deta: DetaClassSDK) {}

  Base(baseName: string, host?: string) {
    return this.deta.Base(baseName, host);
  }

  Drive(driveName: string, host?: string) {
    return this.deta.Drive(driveName, host);
  }

  BaseSafe(
    baseName: string,
    schema: z.ZodType<RecordType>,
    validation = true,
    host?: string
  ) {
    return new BaseSafeClass(
      this.deta.Base(baseName, host),
      schema,
      validation
    );
  }
}

export function Deta(projectKey?: string, authToken?: string) {
  return new DetaClass(DetaSDK(projectKey, authToken));
}
