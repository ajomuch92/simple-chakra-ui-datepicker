export function ternary<T>(condition: boolean|string|number|undefined|null, trulyVal: unknown, falsyVal: unknown): T {
    return (condition ? trulyVal : falsyVal) as T;
}