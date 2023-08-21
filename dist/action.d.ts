import { ActionsForType, ActionValue, AnyType } from "./types";
export declare enum ActionTypes {
    Set = "set",
    Trim = "trim",
    Increment = "increment",
    Append = "append",
    Prepend = "prepend"
}
export declare class Action<T extends AnyType, A extends ActionsForType<T>, V extends ActionValue<T, A>> {
    readonly operation: A;
    readonly value: V;
    constructor(operation: A, value: V);
}
