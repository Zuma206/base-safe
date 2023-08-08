/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */

import DetaClassSDK from "deta/dist/types/deta";
import { KeyType } from "deta/dist/types/types/key";
import { z } from "zod";
import { BaseSafeClass } from "./base";
import { RecordType } from "./types";

export class DetaClass extends DetaClassSDK {
  public BaseSafe<T extends RecordType>(
    baseName: string,
    schema: z.ZodType<T>,
    validation: boolean = true,
    host?: string
  ) {
    const name = baseName?.trim();
    if (!name) {
      throw new Error("Base name is not defined");
    }

    const { key, type, projectId } = this as any;
    return new BaseSafeClass(
      key,
      type,
      projectId,
      name,
      schema,
      validation,
      host
    );
  }
}

export function Deta(projectKey?: string, authToken?: string) {
  const token = authToken?.trim();
  const key = projectKey?.trim();
  if (token && key) {
    return new DetaClass(token, KeyType.AuthToken, key);
  }

  const apiKey = key || process.env.DETA_PROJECT_KEY?.trim();
  if (!apiKey) {
    throw new Error("Project key is not defined");
  }

  return new DetaClass(apiKey, KeyType.ProjectKey, apiKey.split("_")[0]);
}
