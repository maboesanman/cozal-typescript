// may try to use immutableJS
export type Immutable = {
    readonly [K: string]: string | number | boolean | Immutable | Immutable[],
}
