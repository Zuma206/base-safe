/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */

import DetaClassSDK from "deta/dist/types/deta";
import BaseClassSDK from "deta/dist/types/base";
import { KeyType } from "deta/dist/types/types/key";
import { z } from "zod";
import { ObjectType } from "deta/dist/types/types/basic";

export class BaseSafeClass<T extends ObjectType> extends BaseClassSDK {
  constructor(
    key: string,
    type: KeyType,
    projectId: string,
    baseName: string,
    public readonly schema: z.ZodType<T>,
    host?: string
  ) {
    super(key, type, projectId, baseName, host);
  }
}

export class DetaClass extends DetaClassSDK {
  public BaseSafe<T extends ObjectType>(
    baseName: string,
    schema: z.ZodType<T>,
    host?: string
  ) {
    const name = baseName?.trim();
    if (!name) {
      throw new Error("Base name is not defined");
    }

    const { key, type, projectId } = this as any;

    return new BaseSafeClass(key, type, projectId, name, schema, host);
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
