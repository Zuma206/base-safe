/**
 * Project: Base-Safe
 * Entry: index.ts
 * Author: Zuma206
 */

import { Deta as DetaSDK } from "deta";
import type DetaClassSDK from "deta/dist/types/deta";
import { z } from "zod";
import { RecordType } from "./types";
import { TypedBase } from "./base";

/**
 * To start working with your Base or Drive, you need to import the Deta class and initialize it. To authenticate with Space, you need to either use the space dev command or provide a Data Key in an environment variable called DETA_PROJECT_KEY. See here for detailed information.

Once you’re authenticated, you can instantiate a subclass called Base with a database name of your choosing or Drive with a drive name of your choosing.

Deta Bases and Drives are created for you automatically when you start using them.
 */
class DetaClass {
  constructor(protected deta: DetaClassSDK) {}

  /**
   * The Base class provides methods to interact with a Deta Base. If you have not yet instantiated the Deta Object, you must do so before you can use the Base Class.
   * @param baseName The name of the Drive.
   * @param host The host of the Drive.
   * @returns An instance of the Deta SDK's BaseClass.
   */
  Base(baseName: string, host?: string) {
    return this.deta.Base(baseName, host);
  }

  /**
   * The Drive class provides methods to interact with a Deta Drive. If you have not yet instantiated the Deta Object, you must do so before you can use the Drive Class.
   * @param driveName The name of the Drive.
   * @param host The host of the Drive.
   * @returns An instance of the Deta SDK's DriveClass.
   */
  Drive(driveName: string, host?: string) {
    return this.deta.Drive(driveName, host);
  }

  /**
   * The Base class provides methods to interact with a Deta Base. If you have not yet instantiated the Deta Object, you must do so before you can use the Base Class. This "Typed" version of the class takes a generic and a schema which are used to type-safe the class.
   * @param baseName The name of the Drive.
   * @param schema The zod object schema to type & validate with.
   * @param validation Whether or not input to the base should be runtime validated (defaults to true).
   * @param host The host of the Drive.
   * @returns An instance of the Deta SDK's BaseClass.
   */
  TypedBase<T extends RecordType>(
    baseName: string,
    schema: z.ZodType<T>,
    validation = true,
    host?: string
  ) {
    return new TypedBase(this.deta.Base(baseName, host), schema, validation);
  }
}

/**
 * To start working with your Base or Drive, you need to import the Deta class and initialize it. To authenticate with Space, you need to either use the space dev command or provide a Data Key in an environment variable called DETA_PROJECT_KEY. See here for detailed information.

Once you’re authenticated, you can instantiate a subclass called Base with a database name of your choosing or Drive with a drive name of your choosing.

Deta Bases and Drives are created for you automatically when you start using them.
 * @param projectKey Optional parameter to specify the project key. Uses the DETA_PROJECT_KEY environment variable by default
 * @param authToken Another optional parameter to specify authentication manually
 * @returns An instance of DetaClass
 */
export function Deta(projectKey?: string, authToken?: string) {
  return new DetaClass(DetaSDK(projectKey, authToken));
}

export { z };
