type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: 
        Base[Key] extends Condition ? Key : never
};

export type FilteredKeys<Base, Condition> = 
    FilterFlags<Base, Condition>[keyof Base];

export type FilteredType<Base, Condition> = 
    Pick<Base, FilteredKeys<Base, Condition>>;

export type primitive = string | number | boolean | undefined | null
export type DeepReadonly<T> = T extends primitive ? T : {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}