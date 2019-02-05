type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: 
        Base[Key] extends Condition ? Key : never
};

export type FilteredKeys<Base, Condition> = 
        FilterFlags<Base, Condition>[keyof Base];

export type FilteredType<Base, Condition> = 
        Pick<Base, FilteredKeys<Base, Condition>>;
