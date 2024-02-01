export function ternary<T>(condition: boolean, trulyVal: unknown, falsyVal: unknown): T {
    return (condition ? trulyVal : falsyVal) as T;
}